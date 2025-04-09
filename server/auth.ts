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
  name: z.string().min(3, "Nome completo é obrigatório"),
  username: z.string().min(3, "Nome de usuário é obrigatório"),
  email: z.string().email("Email inválido"),
  password: passwordSchema,
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

// Change password validation schema
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual é obrigatória"),
  newPassword: passwordSchema,
  confirmNewPassword: z.string().min(1, "Confirmação da nova senha é obrigatória"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "As senhas não coincidem",
  path: ["confirmNewPassword"],
});

type RegisterData = z.infer<typeof registerSchema>;
type LoginData = z.infer<typeof loginSchema>;
type ChangePasswordData = z.infer<typeof changePasswordSchema>;

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
      console.log("Register request body:", req.body);
      
      // Validate request com confirmPassword
      const validatedData = registerSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        console.error("Erro de validação:", validatedData.error.errors);
        return res.status(400).json({ errors: validatedData.error.errors });
      }
      
      const { username, email, name, password, confirmPassword } = validatedData.data;
      
      // Validação extra das senhas
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "As senhas não coincidem" });
      }
      
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
        role: "member", // Set default role
        avatar: null,
        createdAt: new Date(),
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

  // Change password route
  app.post("/api/change-password", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request data
      const validatedData = changePasswordSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        return res.status(400).json({ errors: validatedData.error.errors });
      }
      
      const { currentPassword, newPassword, confirmNewPassword } = validatedData.data;
      
      // Validate that passwords match
      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: "As novas senhas não coincidem" });
      }
      
      // Get the current user
      if (!req.user) {
        return res.status(401).json({ message: "Não autenticado" });
      }
      
      const user = await storage.getUser(req.user.id);
      
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      // Verify current password
      const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password);
      
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: "Senha atual incorreta" });
      }
      
      // Hash the new password
      const hashedNewPassword = await hashPassword(newPassword);
      
      // Update the user's password
      const updatedUser = await storage.updateUser(req.user!.id, {
        password: hashedNewPassword
      });
      
      if (!updatedUser) {
        return res.status(500).json({ message: "Falha ao atualizar a senha" });
      }
      
      // Return success response
      res.status(200).json({ message: "Senha alterada com sucesso" });
    } catch (error) {
      next(error);
    }
  });

  // Password recovery route
  app.post("/api/forgot-password", async (req, res, next) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email é obrigatório" });
      }

      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      // Gerar token temporário
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

      // Salvar token no usuário
      await storage.updateUser(user.id, {
        resetToken,
        resetTokenExpiry
      });

      // TODO: Enviar email com o link de reset
      // Por enquanto, retornamos o token para teste
      res.json({ 
        message: "Instruções de recuperação de senha foram enviadas para seu email",
        token: resetToken // Remover em produção
      });
    } catch (error) {
      next(error);
    }
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
