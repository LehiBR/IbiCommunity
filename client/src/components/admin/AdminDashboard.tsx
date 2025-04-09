import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { UserManagement } from "./UserManagement";
import { ContentManagement } from "./ContentManagement";
import { DashboardStats } from "./DashboardStats";
import { motion } from "framer-motion";

export function AdminDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch admin user - to verify the user has admin rights
  const { isLoading: isLoadingUser, error: userError } = useQuery({
    queryKey: ['/api/user'],
    onSuccess: (data) => {
      if (data.role !== 'admin') {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar o painel administrativo.",
          variant: "destructive"
        });
      }
    },
    onError: () => {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para acessar esta página.",
        variant: "destructive"
      });
    }
  });

  // Fetch dashboard stats
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/admin/stats'],
    enabled: !isLoadingUser && !userError,
    onError: () => {
      toast({
        title: "Erro ao carregar estatísticas",
        description: "Não foi possível carregar as estatísticas do sistema.",
        variant: "destructive"
      });
    }
  });

  if (isLoadingUser || isLoadingStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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

  return (
    <motion.div 
      className="container py-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 
        className="text-3xl font-bold mb-6"
        variants={itemVariants}
      >
        Painel Administrativo
      </motion.h1>
      
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            {statsData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <DashboardStats stats={statsData} />
              </motion.div>
            )}
          </TabsContent>
          
          <TabsContent value="users" className="mt-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <UserManagement />
            </motion.div>
          </TabsContent>
          
          <TabsContent value="content" className="mt-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ContentManagement />
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}