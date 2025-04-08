import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/layout/Sidebar";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { useAuth } from "@/hooks/use-auth";
import type { Post, Event, ForumPost } from "@shared/schema";

const Dashboard = () => {
  const [location] = useLocation();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAdmin = user?.role === "admin";

  // Toggling the sidebar for mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Fetch latest news
  const { data: latestNews, isLoading: loadingNews } = useQuery<Post[]>({
    queryKey: ["/api/posts", "latest"],
    queryFn: async () => {
      const res = await fetch("/api/posts?limit=4");
      if (!res.ok) throw new Error("Failed to fetch posts");
      return await res.json();
    }
  });

  // Fetch upcoming events
  const { data: upcomingEvents, isLoading: loadingEvents } = useQuery<Event[]>({
    queryKey: ["/api/events", "upcoming"],
    queryFn: async () => {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 14);
      
      const res = await fetch(`/api/events?startDate=${today.toISOString()}&endDate=${nextWeek.toISOString()}&limit=3`);
      if (!res.ok) throw new Error("Failed to fetch events");
      return await res.json();
    }
  });

  // Fetch recent forum topics
  const { data: forumTopics, isLoading: loadingForum } = useQuery<ForumPost[]>({
    queryKey: ["/api/forum", "recent"],
    queryFn: async () => {
      const res = await fetch("/api/forum?limit=5");
      if (!res.ok) throw new Error("Failed to fetch forum topics");
      return await res.json();
    }
  });

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
            <h1 className="text-xl font-bold text-gray-800">Painel do Membro</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 hidden md:inline-block">
              Bem-vindo(a), {user?.name}
            </span>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <main className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content (2/3 width on large screens) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Welcome Card */}
              <DashboardCard title="Bem-vindo(a) à sua área de membro">
                <p className="text-gray-600 mb-4">
                  Aqui você pode acessar recursos exclusivos, participar do fórum
                  da igreja, ver os próximos eventos e muito mais.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/forum">
                    <Button className="w-full">
                      <span className="material-icons mr-2">forum</span>
                      Fórum
                    </Button>
                  </Link>
                  <Link href="/biblestudy">
                    <Button variant="outline" className="w-full">
                      <span className="material-icons mr-2">menu_book</span>
                      Estudos
                    </Button>
                  </Link>
                  <Link href="/photos">
                    <Button variant="outline" className="w-full">
                      <span className="material-icons mr-2">photo_library</span>
                      Fotos
                    </Button>
                  </Link>
                </div>
              </DashboardCard>
              
              {/* Latest News */}
              <DashboardCard 
                title="Últimas Notícias" 
                actionText="Ver Todas" 
                actionLink="/news"
              >
                {loadingNews ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="border-b pb-4 animate-pulse">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                ) : latestNews && latestNews.length > 0 ? (
                  <div className="space-y-4">
                    {latestNews.map((post) => (
                      <div key={post.id} className="border-b pb-4 last:border-0 last:pb-0">
                        <h4 className="font-medium text-primary mb-1">{post.title}</h4>
                        <p className="text-sm text-gray-600 mb-1">
                          {post.content.length > 100 
                            ? post.content.substring(0, 100) + "..." 
                            : post.content}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="material-icons text-xs mr-1">calendar_today</span>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Nenhuma notícia disponível no momento.
                  </p>
                )}
              </DashboardCard>
            </div>
            
            {/* Sidebar Content (1/3 width on large screens) */}
            <div className="space-y-6">
              {/* Upcoming Events */}
              <DashboardCard 
                title="Próximos Eventos" 
                actionText="Ver Agenda" 
                actionLink="/calendar"
              >
                {loadingEvents ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="border-b pb-4 animate-pulse">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : upcomingEvents && upcomingEvents.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-start border-b pb-3 last:border-0 last:pb-0">
                        <div className="bg-primary/10 text-primary p-2 rounded text-center mr-3 min-w-[60px]">
                          <span className="block text-sm font-medium">
                            {new Date(event.startDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{event.title}</h4>
                          <p className="text-xs text-gray-500 flex items-center">
                            <span className="material-icons text-xs mr-1">schedule</span>
                            {new Date(event.startDate).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Nenhum evento próximo agendado.
                  </p>
                )}
              </DashboardCard>
              
              {/* Recent Forum Topics */}
              <DashboardCard 
                title="Fórum Recente" 
                actionText="Ir para o Fórum" 
                actionLink="/forum"
              >
                {loadingForum ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="border-b pb-3 animate-pulse">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : forumTopics && forumTopics.length > 0 ? (
                  <div className="space-y-3">
                    {forumTopics.map((topic) => (
                      <div key={topic.id} className="border-b pb-3 last:border-0 last:pb-0">
                        <Link href={`/forum/${topic.id}`}>
                          <h4 className="font-medium text-primary hover:text-blue-700 transition mb-1">
                            {topic.title}
                          </h4>
                        </Link>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{(topic as any).author?.name || "Anônimo"}</span>
                          <div className="flex items-center">
                            <span className="material-icons text-xs mr-1">forum</span>
                            <span>{(topic as any).commentCount || 0} comentários</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Nenhum tópico recente no fórum.
                  </p>
                )}
              </DashboardCard>
              
              {/* Admin Quick Links (if user is admin) */}
              {isAdmin && (
                <DashboardCard title="Administração">
                  <div className="space-y-2">
                    <Link href="/dashboard/posts">
                      <Button variant="outline" className="w-full justify-start">
                        <span className="material-icons mr-2">article</span>
                        Gerenciar Postagens
                      </Button>
                    </Link>
                    <Link href="/dashboard/events">
                      <Button variant="outline" className="w-full justify-start">
                        <span className="material-icons mr-2">event</span>
                        Gerenciar Eventos
                      </Button>
                    </Link>
                    <Link href="/dashboard/messages">
                      <Button variant="outline" className="w-full justify-start">
                        <span className="material-icons mr-2">email</span>
                        Mensagens de Contato
                      </Button>
                    </Link>
                    <Link href="/dashboard/resources">
                      <Button variant="outline" className="w-full justify-start">
                        <span className="material-icons mr-2">attachment</span>
                        Gerenciar Downloads
                      </Button>
                    </Link>
                  </div>
                </DashboardCard>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
