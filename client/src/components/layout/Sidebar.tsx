import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!user) return null;

  const isAdmin = user.role === 'admin';
  const userInitials = user.name
    .split(' ')
    .map(name => name[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const menuItems = [
    { path: '/dashboard', icon: 'dashboard', label: 'Painel' },
    { path: '/forum', icon: 'forum', label: 'Fórum' },
    { path: '/biblestudy', icon: 'auto_stories', label: 'Estudos Bíblicos' },
    { path: '/photos', icon: 'photo_library', label: 'Galeria de Fotos' },
  ];

  const adminMenuItems = [
    { path: '/dashboard/posts', icon: 'article', label: 'Postagens' },
    { path: '/dashboard/events', icon: 'event', label: 'Eventos' },
    { path: '/dashboard/resources', icon: 'folder', label: 'Recursos' },
    { path: '/dashboard/messages', icon: 'email', label: 'Mensagens' },
    { path: '/dashboard/users', icon: 'people', label: 'Usuários' },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`bg-sidebar text-sidebar-foreground h-screen fixed left-0 top-0 z-40 w-64 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                <span className="material-icons text-sm">church</span>
              </div>
              <span className="font-bold text-white">IBI Parnaíba</span>
            </Link>
            <button 
              className="md:hidden text-gray-300 hover:text-white"
              onClick={toggleSidebar}
            >
              <span className="material-icons">close</span>
            </button>
          </div>
          
          {/* User info */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-white">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Menu Principal</p>
              {menuItems.map((item) => (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm ${
                    location === item.path 
                      ? 'bg-primary text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-sidebar-accent'
                  }`}
                >
                  <span className="material-icons text-sm mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>

            {isAdmin && (
              <div className="mt-8 space-y-1">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Administração</p>
                {adminMenuItems.map((item) => (
                  <Link 
                    key={item.path}
                    href={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm ${
                      location === item.path 
                        ? 'bg-primary text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-sidebar-accent'
                    }`}
                  >
                    <span className="material-icons text-sm mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-gray-300 hover:text-white text-sm flex items-center">
                <span className="material-icons text-sm mr-2">home</span>
                Página Inicial
              </Link>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-sidebar-accent"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? (
                  <span className="material-icons animate-spin text-sm">autorenew</span>
                ) : (
                  <span className="material-icons text-sm">logout</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
