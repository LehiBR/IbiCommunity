
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth, type LoginData, type RegisterData } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { FiUser, FiLock, FiMail, FiUserPlus, FiLogIn, FiRefreshCw } from "react-icons/fi";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, "Nome de usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

// Registration form schema
const registerSchema = z.object({
  name: z.string().min(3, "Nome completo é obrigatório e deve ter pelo menos 3 caracteres"),
  username: z.string().min(3, "Nome de usuário deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

const AuthForm = () => {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [isRecovering, setIsRecovering] = useState(false);

  // Parse the redirect parameter from the URL manually
  const getRedirectUrl = () => {
    try {
      const url = new URL(window.location.href);
      return url.searchParams.get("redirect") || "/dashboard";
    } catch (error) {
      return "/dashboard";
    }
  };

  const redirectTo = getRedirectUrl();
  const { loginMutation, registerMutation } = useAuth();

  // Login form
  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = (data: LoginData) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        window.location.href = redirectTo;
      }
    });
  };

  const onRegisterSubmit = (data: RegisterData) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        window.location.href = redirectTo;
      }
    });
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRecovering(true);
    
    try {
      // Verificar se o email foi fornecido
      if (!recoveryEmail || recoveryEmail.trim() === "") {
        throw new Error("Por favor, digite seu email");
      }
      
      // Enviar solicitação de recuperação de senha
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: recoveryEmail }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Erro ao processar a solicitação");
      }
      
      // Se chegou até aqui, exibe mensagem de sucesso
      alert(data.message);
      setShowForgotPassword(false);
    } catch (error: any) {
      alert(error.message || "Ocorreu um erro. Por favor, tente novamente.");
    } finally {
      setIsRecovering(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300 }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card className="w-full max-w-md shadow-lg">
        <Tabs value={tab} onValueChange={(value) => setTab(value as "login" | "register")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Cadastrar</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <CardHeader>
              <motion.div variants={itemVariants}>
                <CardTitle>Área do Membro</CardTitle>
                <CardDescription>Entre com suas credenciais para acessar o sistema.</CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              <form id="login-form" onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                <div className="space-y-4">
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="username">Nome de Usuário</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <FiUser size={18} />
                      </div>
                      <Input
                        id="username"
                        type="text"
                        className="pl-10"
                        placeholder="Seu nome de usuário"
                        {...loginForm.register("username")}
                      />
                    </div>
                    {loginForm.formState.errors.username && (
                      <p className="text-sm text-red-500">
                        {loginForm.formState.errors.username.message}
                      </p>
                    )}
                  </motion.div>
                  <motion.div variants={itemVariants} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Senha</Label>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-primary hover:underline"
                      >
                        Esqueceu a senha?
                      </motion.button>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <FiLock size={18} />
                      </div>
                      <Input
                        id="password"
                        type="password"
                        className="pl-10"
                        placeholder="Sua senha"
                        {...loginForm.register("password")}
                      />
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-red-500">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </motion.div>
                  <motion.div variants={itemVariants} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                    />
                    <Label htmlFor="remember" className="text-sm font-normal">
                      Lembrar-me
                    </Label>
                  </motion.div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <motion.div 
                variants={itemVariants}
                className="w-full"
                whileHover="hover"
                whileTap="tap"
              >
                <Button 
                  type="submit" 
                  form="login-form" 
                  className="w-full transition-all"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <div className="flex items-center">
                      <FiRefreshCw className="mr-2 animate-spin" />
                      <span>Processando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <FiLogIn className="mr-2" />
                      <span>Entrar</span>
                    </div>
                  )}
                </Button>
              </motion.div>
            </CardFooter>
          </TabsContent>

          <TabsContent value="register">
            <CardHeader>
              <motion.div variants={itemVariants}>
                <CardTitle>Criar uma conta</CardTitle>
                <CardDescription>Registre-se para acessar o conteúdo exclusivo para membros.</CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              <form id="register-form" onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                <div className="space-y-4">
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <FiUser size={18} />
                      </div>
                      <Input
                        id="name"
                        type="text"
                        className="pl-10"
                        placeholder="Seu nome completo"
                        {...registerForm.register("name")}
                      />
                    </div>
                    {registerForm.formState.errors.name && (
                      <p className="text-sm text-red-500">
                        {registerForm.formState.errors.name.message}
                      </p>
                    )}
                  </motion.div>
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="register-username">Nome de Usuário</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <FiUser size={18} />
                      </div>
                      <Input
                        id="register-username"
                        type="text"
                        className="pl-10"
                        placeholder="Escolha um nome de usuário"
                        {...registerForm.register("username")}
                      />
                    </div>
                    {registerForm.formState.errors.username && (
                      <p className="text-sm text-red-500">
                        {registerForm.formState.errors.username.message}
                      </p>
                    )}
                  </motion.div>
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <FiMail size={18} />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        className="pl-10"
                        placeholder="seu@email.com"
                        {...registerForm.register("email")}
                      />
                    </div>
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-red-500">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </motion.div>
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="register-password">Senha</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <FiLock size={18} />
                      </div>
                      <Input
                        id="register-password"
                        type="password"
                        className="pl-10"
                        placeholder="Crie uma senha forte"
                        {...registerForm.register("password")}
                      />
                    </div>
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-red-500">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </motion.div>
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <FiLock size={18} />
                      </div>
                      <Input
                        id="confirmPassword"
                        type="password"
                        className="pl-10"
                        placeholder="Confirme sua senha"
                        {...registerForm.register("confirmPassword")}
                      />
                    </div>
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {registerForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </motion.div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <motion.div 
                variants={itemVariants}
                className="w-full"
                whileHover="hover"
                whileTap="tap"
              >
                <Button 
                  type="submit" 
                  form="register-form" 
                  className="w-full transition-all"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <div className="flex items-center">
                      <FiRefreshCw className="mr-2 animate-spin" />
                      <span>Processando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <FiUserPlus className="mr-2" />
                      <span>Cadastrar</span>
                    </div>
                  )}
                </Button>
              </motion.div>
            </CardFooter>
          </TabsContent>
        </Tabs>

        {/* Modal de Recuperação de Senha */}
        <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
          <DialogContent>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle>Recuperar Senha</DialogTitle>
                <DialogDescription>
                  Digite seu email para receber instruções de recuperação de senha.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <Label htmlFor="recovery-email">Email</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-gray-400">
                      <FiMail size={18} />
                    </div>
                    <Input
                      id="recovery-email"
                      type="email"
                      className="pl-10"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" className="w-full" disabled={isRecovering}>
                    {isRecovering ? (
                      <div className="flex items-center">
                        <FiRefreshCw className="mr-2 animate-spin" />
                        <span>Enviando...</span>
                      </div>
                    ) : (
                      <span>Enviar Instruções</span>
                    )}
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          </DialogContent>
        </Dialog>
      </Card>
    </motion.div>
  );
};

export default AuthForm;
