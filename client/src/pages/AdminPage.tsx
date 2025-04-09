import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function AdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    // Redirecionar usuários não administradores
    if (user && user.role !== 'admin') {
      toast({
        title: "Acesso restrito",
        description: "Você não tem permissão para acessar o painel administrativo.",
        variant: "destructive"
      });
      setLocation('/');
    } else if (!user) {
      toast({
        title: "Acesso restrito",
        description: "Você precisa estar logado para acessar esta página.",
        variant: "destructive"
      });
      setLocation('/auth');
    }
  }, [user, toast, setLocation]);
  
  // Se não for admin, não renderizar o conteúdo da página
  if (!user || user.role !== 'admin') {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <AdminDashboard />
    </div>
  );
}