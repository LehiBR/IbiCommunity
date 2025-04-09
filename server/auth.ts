import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { compare, hash } from "bcrypt";
import { storage } from "./storage";
import { insertUserSchema, type User, type InsertUser } from "@shared/schema";
import { z } from "zod";

// Augment the Express Request type to include user property
declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      email: string;
      name: string;
      role: string;
      avatar: string | null;
      createdAt: Date;
    }
  }
}

// Password validation schema
const passwordSchema = z.string().min(6, "A senha deve ter pelo menos 6 caracteres");

// Login validation schema
const loginSchema = z.object({
  username: z.string().min(1, "Nome de usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

// Registration validation with password confirmation
const registerSchema = insertUserSchema.extend({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterData = z.infer<typeof registerSchema>;
type LoginData = z.infer<typeof loginSchema>;

// Hash password
const hashPassword = async (password: string): Promise<string> => {
  return await hash(password, 10);
};

// Verify password
const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await compare(password, hashedPassword);
};

// Configure passport and auth routes
export function setupAuth(app: Express): void {
  // Configure session
  app.use(
    session({
      store: storage.sessionStore,
      secret: process.env.SESSION_SECRET || "igreja-batista-independente-parnaiba",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
    })
  );

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        
        if (!user) {
          return done(null, false, { message: "Nome de usuário ou senha incorretos" });
        }
        
        const isValid = await verifyPassword(password, user.password);
        
        if (!isValid) {
          return done(null, false, { message: "Nome de usuário ou senha incorretos" });
        }
        
        // Don't send password to client
        const { password: _, ...userWithoutPassword } = user;
        return done(null, userWithoutPassword);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Serialize user to the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      // Don't send password to client
      const { password: _, ...userWithoutPassword } = user;
      done(null, userWithoutPassword);
    } catch (error) {
      done(error);
    }
  });

  // Auth middleware
  const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Não autorizado" });
  };

  const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated() && req.user.role === "admin") {
      return next();
    }
    res.status(403).json({ message: "Acesso negado" });
  };

  // Authentication routes
  app.post("/api/login", (req, res, next) => {
    try {
      // Validate request
      const { username, password } = loginSchema.parse(req.body);
      
      passport.authenticate("local", (err: Error, user: Express.User, info: { message: string }) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(401).json({ message: info.message });
        }
        
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          return res.json(user);
        });
      })(req, res, next);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  });

  app.post("/api/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request
      const { username, email, name, password } = registerSchema.parse(req.body);
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: "Nome de usuário já está em uso" });
      }
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email já está em uso" });
      }
      
      // Hash password
      const hashedPassword = await hashPassword(password);
      
      // Create user
      const user = await storage.createUser({
        username,
        email,
        name,
        password: hashedPassword,
      });
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      // Log in the user automatically
      req.login(userWithoutPassword, (err) => {
        if (err) {
          return next(err);
        }
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao sair" });
      }
      return res.status(200).json({ message: "Logout realizado com sucesso" });
    });
  });

  app.get("/api/user", (req, res) => {
    if (req.isAuthenticated()) {
      return res.json(req.user);
    }
    res.status(401).json({ message: "Não autenticado" });
  });

  // Export middleware for use in other routes
  app.locals.isAuthenticated = isAuthenticated;
  app.locals.isAdmin = isAdmin;
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Não autorizado" });
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Acesso negado" });
};
