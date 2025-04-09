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
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";

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
  const [location] = useLocation();
  
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
    console.log("Dados de registro:", data);
    registerMutation.mutate(data, {
      onSuccess: () => {
        window.location.href = redirectTo;
      }
    });
  };

  return (
    <Card className="w-full max-w-md">
      <Tabs value={tab} onValueChange={(value) => setTab(value as "login" | "register")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Entrar</TabsTrigger>
          <TabsTrigger value="register">Cadastrar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <CardHeader>
            <CardTitle>Área do Membro</CardTitle>
            <CardDescription>Entre com suas credenciais para acessar o sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="login-form" onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Nome de Usuário</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Seu nome de usuário"
                    {...loginForm.register("username")}
                  />
                  {loginForm.formState.errors.username && (
                    <p className="text-sm text-red-500">
                      {loginForm.formState.errors.username.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </button>

                  {/* Modal de Recuperação de Senha */}
                  {showForgotPassword && (
                    <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Recuperar Senha</DialogTitle>
                          <DialogDescription>
                            Digite seu email para receber instruções de recuperação de senha.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                          <div>
                            <Label htmlFor="recovery-email">Email</Label>
                            <Input
                              id="recovery-email"
                              type="email"
                              value={recoveryEmail}
                              onChange={(e) => setRecoveryEmail(e.target.value)}
                              placeholder="seu@email.com"
                            />
                          </div>
                          <Button type="submit" className="w-full" disabled={isRecovering}>
                            {isRecovering ? (
                              <>
                                <span className="material-icons animate-spin mr-2">autorenew</span>
                                Enviando...
                              </>
                            ) : (
                              "Enviar Instruções"
                            )}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Sua senha"
                    {...loginForm.register("password")}
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-red-500">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                  />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Lembrar-me
                  </Label>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              form="login-form" 
              className="w-full" 
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <span className="material-icons animate-spin mr-2">autorenew</span>
              ) : (
                <span className="material-icons mr-2">login</span>
              )}
              Entrar
            </Button>
          </CardFooter>
        </TabsContent>
        
        <TabsContent value="register">
          <CardHeader>
            <CardTitle>Criar uma conta</CardTitle>
            <CardDescription>Registre-se para acessar o conteúdo exclusivo para membros.</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="register-form" onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    {...registerForm.register("name")}
                  />
                  {registerForm.formState.errors.name && (
                    <p className="text-sm text-red-500">
                      {registerForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-username">Nome de Usuário</Label>
                  <Input
                    id="register-username"
                    type="text"
                    placeholder="Escolha um nome de usuário"
                    {...registerForm.register("username")}
                  />
                  {registerForm.formState.errors.username && (
                    <p className="text-sm text-red-500">
                      {registerForm.formState.errors.username.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    {...registerForm.register("email")}
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-sm text-red-500">
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Crie uma senha forte"
                    {...registerForm.register("password")}
                  />
                  {registerForm.formState.errors.password && (
                    <p className="text-sm text-red-500">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirme sua senha"
                    {...registerForm.register("confirmPassword")}
                  />
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {registerForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              form="register-form" 
              className="w-full" 
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <span className="material-icons animate-spin mr-2">autorenew</span>
              ) : (
                <span className="material-icons mr-2">person_add</span>
              )}
              Cadastrar
            </Button>
          </CardFooter>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuthForm;
