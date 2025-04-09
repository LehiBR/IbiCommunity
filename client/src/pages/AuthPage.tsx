import { useEffect } from "react";
import { useLocation } from "wouter";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/hooks/use-auth";
import { MessageCircle, BookOpen, Calendar, Church } from "lucide-react";

const AuthPage = () => {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const [searchParams] = useLocation();
  const redirectTo = new URLSearchParams(searchParams?.split("?")[1] || "").get("redirect") || "/dashboard";

  // Redirect if user is already logged in
  useEffect(() => {
    if (!isLoading && user) {
      setLocation(redirectTo);
    }
  }, [user, isLoading, setLocation, redirectTo]);

  // If still loading or user is logged in, don't show the form
  if (isLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-stretch">
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="hidden md:block md:w-1/2 bg-primary p-8 text-white">
        <div className="h-full flex flex-col justify-center max-w-md mx-auto">
          <div className="mb-8">
            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-primary mb-4">
              <Church size={32} />
            </div>
            <h1 className="text-3xl font-bold mb-4 font-heading">
              Igreja Batista Independente de Parnaíba
            </h1>
            <p className="text-white/80 text-lg mb-6">
              Bem-vindo à nossa comunidade online. Faça login ou crie uma conta para acessar recursos exclusivos.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <MessageCircle className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Fórum da Comunidade</h3>
                <p className="text-white/70">
                  Participe de discussões, compartilhe testemunhos e interaja com outros membros.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <BookOpen className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Estudos Bíblicos</h3>
                <p className="text-white/70">
                  Acesse materiais exclusivos de estudo, vídeos e atividades para crescimento espiritual.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <Calendar className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Calendário de Eventos</h3>
                <p className="text-white/70">
                  Fique por dentro de todos os eventos e atividades da igreja.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
