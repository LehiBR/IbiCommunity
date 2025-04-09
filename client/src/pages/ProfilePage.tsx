import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/layout/Sidebar";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const ProfilePage = (): JSX.Element => {
  const [location] = useLocation();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Toggling the sidebar for mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="material-icons animate-spin text-primary text-3xl mb-2">autorenew</span>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  const userInitials = user.name
    .split(" ")
    .map(name => name[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              className="md:hidden mr-4 text-gray-600"
              onClick={toggleSidebar}
            >
              <span className="material-icons">menu</span>
            </button>
            <h1 className="text-xl font-bold text-gray-800">Meu Perfil</h1>
          </div>
        </header>
        
        {/* Profile Content */}
        <main className="p-6">
          <div className="max-w-3xl mx-auto">
            {/* Profile Header */}
            <div className="mb-6 bg-white rounded-lg shadow p-6 flex items-center">
              <Avatar className="h-16 w-16 mr-6">
                <AvatarFallback className="bg-primary text-white text-xl">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="capitalize">{user.role}</span> · Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            
            {/* Profile Tabs */}
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="account">Informações da Conta</TabsTrigger>
                <TabsTrigger value="security">Segurança</TabsTrigger>
              </TabsList>
              
              {/* Account Info Tab */}
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações da Conta</CardTitle>
                    <CardDescription>
                      Veja e gerencie as informações da sua conta.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium text-gray-500 text-sm mb-1">Nome Completo</h3>
                        <p className="text-gray-800">{user.name}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-500 text-sm mb-1">Nome de Usuário</h3>
                        <p className="text-gray-800">{user.username}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-500 text-sm mb-1">Email</h3>
                        <p className="text-gray-800">{user.email}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-500 text-sm mb-1">Tipo de Conta</h3>
                        <p className="text-gray-800 capitalize">{user.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Security Tab */}
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Segurança</CardTitle>
                    <CardDescription>
                      Gerencie sua senha e configurações de segurança.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Alterar Senha</h3>
                        <ChangePasswordForm />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;