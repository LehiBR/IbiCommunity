import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo and site name */}
          <Link href="/" className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white mr-3">
              <span className="material-icons">church</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-primary">IBI Parnaíba</h1>
              <p className="text-xs text-gray-600">Igreja Batista Independente</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link href="/" className={`text-sm ${location === '/' ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary'} transition`}>
              Início
            </Link>
            <Link href="/about" className={`text-sm ${location === '/about' ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary'} transition`}>
              Sobre
            </Link>
            <Link href="/ministries" className={`text-sm ${location === '/ministries' ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary'} transition`}>
              Ministérios
            </Link>
            <Link href="/calendar" className={`text-sm ${location === '/calendar' ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary'} transition`}>
              Agenda
            </Link>
            <Link href="/downloads" className={`text-sm ${location === '/downloads' ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary'} transition`}>
              Downloads
            </Link>
            <Link href="/contact" className={`text-sm ${location === '/contact' ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary'} transition`}>
              Contato
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-3">
                <Link href="/dashboard">
                  <Button variant="secondary" size="sm" className="flex items-center">
                    <span className="material-icons text-sm mr-1">dashboard</span>
                    Meu Painel
                  </Button>
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin">
                    <Button variant="secondary" size="sm" className="flex items-center bg-amber-500 hover:bg-amber-600 text-white">
                      <span className="material-icons text-sm mr-1">admin_panel_settings</span>
                      Admin
                    </Button>
                  </Link>
                )}
                <Button variant="outline" size="sm" onClick={handleLogout} disabled={logoutMutation.isPending}>
                  {logoutMutation.isPending ? (
                    <span className="material-icons animate-spin">autorenew</span>
                  ) : (
                    <span className="material-icons text-sm mr-1">logout</span>
                  )}
                  Sair
                </Button>
              </div>
            ) : (
              <Link href="/auth">
                <Button className="bg-primary hover:bg-blue-700 text-white">
                  Entrar
                </Button>
              </Link>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            <span className="material-icons">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
        
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 px-2 bg-white border-t space-y-3 animate-in fade-in slide-in-from-top-5">
            <Link href="/" className={`block py-2 px-2 rounded ${location === '/' ? 'text-primary font-semibold' : 'text-gray-700'} hover:bg-gray-100`}>
              Início
            </Link>
            <Link href="/about" className={`block py-2 px-2 rounded ${location === '/about' ? 'text-primary font-semibold' : 'text-gray-700'} hover:bg-gray-100`}>
              Sobre
            </Link>
            <Link href="/ministries" className={`block py-2 px-2 rounded ${location === '/ministries' ? 'text-primary font-semibold' : 'text-gray-700'} hover:bg-gray-100`}>
              Ministérios
            </Link>
            <Link href="/calendar" className={`block py-2 px-2 rounded ${location === '/calendar' ? 'text-primary font-semibold' : 'text-gray-700'} hover:bg-gray-100`}>
              Agenda
            </Link>
            <Link href="/downloads" className={`block py-2 px-2 rounded ${location === '/downloads' ? 'text-primary font-semibold' : 'text-gray-700'} hover:bg-gray-100`}>
              Downloads
            </Link>
            <Link href="/contact" className={`block py-2 px-2 rounded ${location === '/contact' ? 'text-primary font-semibold' : 'text-gray-700'} hover:bg-gray-100`}>
              Contato
            </Link>
            
            <div className="pt-2 border-t border-gray-200">
              {user ? (
                <div className="space-y-2">
                  <Link href="/dashboard">
                    <Button variant="secondary" className="w-full justify-start">
                      <span className="material-icons mr-2">dashboard</span>
                      Meu Painel
                    </Button>
                  </Link>
                  {user.role === 'admin' && (
                    <Link href="/admin">
                      <Button variant="secondary" className="w-full justify-start bg-amber-500 hover:bg-amber-600 text-white">
                        <span className="material-icons mr-2">admin_panel_settings</span>
                        Administração
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                  >
                    {logoutMutation.isPending ? (
                      <span className="material-icons animate-spin mr-2">autorenew</span>
                    ) : (
                      <span className="material-icons mr-2">logout</span>
                    )}
                    Sair
                  </Button>
                </div>
              ) : (
                <Link href="/auth" className="block w-full">
                  <Button className="w-full bg-primary hover:bg-blue-700 text-white">
                    <span className="material-icons mr-2">login</span>
                    Entrar
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
