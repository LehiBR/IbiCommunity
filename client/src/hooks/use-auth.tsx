import { createContext, useContext, ReactNode } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { insertUserSchema, type User } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useLocation } from "wouter";

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

export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;

type AuthContextType = {
  user: Omit<User, "password"> | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<Omit<User, "password">, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<Omit<User, "password">, Error, RegisterData>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const {
    data: user,
    error,
    isLoading,
  } = useQuery<Omit<User, "password"> | null, Error>({
    queryKey: ["/api/user"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/user", {
          credentials: "include",
        });
        
        if (res.status === 401) {
          return null;
        }
        return await res.json();
      } catch (error) {
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      try {
        const res = await apiRequest("POST", "/api/login", credentials);
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || errorData.errors?.[0]?.message || "Credenciais inválidas");
        }
        
        return await res.json();
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Erro ao fazer login");
      }
    },
    onSuccess: (userData: Omit<User, "password">) => {
      queryClient.setQueryData(["/api/user"], userData);
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo(a) de volta, ${userData.name}!`,
      });
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Falha no login",
        description: error.message || "Credenciais inválidas. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      try {
        const { confirmPassword, ...registerData } = data;
        const res = await apiRequest("POST", "/api/register", registerData);
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || errorData.errors?.[0]?.message || "Erro ao cadastrar");
        }
        
        return await res.json();
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Erro ao cadastrar");
      }
    },
    onSuccess: (userData: Omit<User, "password">) => {
      try {
        queryClient.setQueryData(["/api/user"], userData);
        toast({
          title: "Cadastro realizado com sucesso",
          description: `Bem-vindo(a) à Igreja Batista Independente de Parnaíba, ${userData.name}!`,
        });
        setTimeout(() => {
          setLocation("/dashboard");
        }, 500);
      } catch (error) {
        console.error("Erro ao processar sucesso no cadastro:", error);
      }
    },
    onError: (error: Error) => {
      let errorMessage = error.message || "Não foi possível criar sua conta. Tente novamente.";
      
      if (errorMessage.includes("too_small") && errorMessage.includes("password")) {
        errorMessage = "A senha deve ter pelo menos 6 caracteres.";
      } else if (errorMessage.includes("too_small") && errorMessage.includes("name")) {
        errorMessage = "Nome completo é obrigatório.";
      } else if (errorMessage.includes("too_small") && errorMessage.includes("username")) {
        errorMessage = "Nome de usuário é obrigatório.";
      } else if (errorMessage.includes("invalid_type") && errorMessage.includes("email")) {
        errorMessage = "Email inválido.";
      }
      
      toast({
        title: "Falha no cadastro",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logout realizado com sucesso",
        description: "Você saiu da sua conta.",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
