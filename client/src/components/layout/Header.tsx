import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, 
  FiInfo, 
  FiUsers, 
  FiCalendar, 
  FiDownload, 
  FiMail,
  FiLogIn, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiSettings,
  FiGrid
} from 'react-icons/fi';

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

  // Animation variants
  const logoVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };
  
  const navItemVariants = {
    initial: { y: -5, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.2 }
    },
    hover: { 
      scale: 1.05,
      color: "var(--color-primary)",
      transition: { duration: 0.2 }
    }
  };

  const mobileMenuVariants = {
    closed: { 
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        when: "afterChildren"
      }
    },
    open: { 
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo and site name */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={logoVariants}
          >
            <Link href="/" className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white mr-3">
                <motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <path d="M18 7c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0Z"></path>
                  <circle cx="12" cy="7" r="1"></circle>
                  <path d="M5 22v-4h14v4"></path>
                </motion.svg>
              </div>
              <div>
                <motion.h1 
                  className="text-xl md:text-2xl font-bold text-primary"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  IBI Parnaíba
                </motion.h1>
                <motion.p 
                  className="text-xs text-gray-600"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  Igreja Batista Independente
                </motion.p>
              </div>
            </Link>
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <motion.div
              initial="initial"
              animate="animate"
              variants={navItemVariants}
              whileHover="hover"
              custom={0}
            >
              <Link href="/" className={`text-sm flex items-center ${location === '/' ? 'text-primary font-semibold' : 'text-gray-700'} transition`}>
                <FiHome className="mr-1" />
                Início
              </Link>
            </motion.div>
            
            <motion.div
              initial="initial"
              animate="animate"
              variants={navItemVariants}
              whileHover="hover"
              custom={1}
            >
              <Link href="/about" className={`text-sm flex items-center ${location === '/about' ? 'text-primary font-semibold' : 'text-gray-700'} transition`}>
                <FiInfo className="mr-1" />
                Sobre
              </Link>
            </motion.div>
            
            <motion.div
              initial="initial"
              animate="animate"
              variants={navItemVariants}
              whileHover="hover"
              custom={2}
            >
              <Link href="/ministries" className={`text-sm flex items-center ${location === '/ministries' ? 'text-primary font-semibold' : 'text-gray-700'} transition`}>
                <FiUsers className="mr-1" />
                Ministérios
              </Link>
            </motion.div>
            
            <motion.div
              initial="initial"
              animate="animate"
              variants={navItemVariants}
              whileHover="hover"
              custom={3}
            >
              <Link href="/calendar" className={`text-sm flex items-center ${location === '/calendar' ? 'text-primary font-semibold' : 'text-gray-700'} transition`}>
                <FiCalendar className="mr-1" />
                Agenda
              </Link>
            </motion.div>
            
            <motion.div
              initial="initial"
              animate="animate"
              variants={navItemVariants}
              whileHover="hover"
              custom={4}
            >
              <Link href="/downloads" className={`text-sm flex items-center ${location === '/downloads' ? 'text-primary font-semibold' : 'text-gray-700'} transition`}>
                <FiDownload className="mr-1" />
                Downloads
              </Link>
            </motion.div>
            
            <motion.div
              initial="initial"
              animate="animate"
              variants={navItemVariants}
              whileHover="hover"
              custom={5}
            >
              <Link href="/contact" className={`text-sm flex items-center ${location === '/contact' ? 'text-primary font-semibold' : 'text-gray-700'} transition`}>
                <FiMail className="mr-1" />
                Contato
              </Link>
            </motion.div>
            
            {user ? (
              <div className="flex items-center space-x-3">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/dashboard">
                    <Button variant="secondary" size="sm" className="flex items-center">
                      <FiGrid className="mr-1" />
                      Meu Painel
                    </Button>
                  </Link>
                </motion.div>
                
                {user.role === 'admin' && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/admin">
                      <Button variant="secondary" size="sm" className="flex items-center bg-amber-500 hover:bg-amber-600 text-white">
                        <FiSettings className="mr-1" />
                        Admin
                      </Button>
                    </Link>
                  </motion.div>
                )}
                
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout} 
                    disabled={logoutMutation.isPending}
                    className="flex items-center"
                  >
                    {logoutMutation.isPending ? (
                      <div className="flex items-center">
                        <FiRefreshCw className="mr-1 animate-spin" />
                        <span>Saindo...</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <FiLogOut className="mr-1" />
                        <span>Sair</span>
                      </div>
                    )}
                  </Button>
                </motion.div>
              </div>
            ) : (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/auth">
                  <Button className="bg-primary hover:bg-blue-700 text-white flex items-center">
                    <FiLogIn className="mr-2" />
                    Entrar
                  </Button>
                </Link>
              </motion.div>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <motion.button 
            className="md:hidden text-gray-700"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </motion.button>
        </div>
        
        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav 
              className="md:hidden py-4 px-2 bg-white border-t space-y-3 overflow-hidden"
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
            >
              <motion.div variants={navItemVariants}>
                <Link href="/" className={`flex items-center py-2 px-2 rounded ${location === '/' ? 'text-primary font-semibold' : 'text-gray-700'} hover:bg-gray-100`}>
                  <FiHome className="mr-2" />
                  Início
                </Link>
              </motion.div>
              
              <motion.div variants={navItemVariants}>
                <Link href="/about" className={`flex items-center py-2 px-2 rounded ${location === '/about' ? 'text-primary font-semibold' : 'text-gray-700'} hover:bg-gray-100`}>
                  <FiInfo className="mr-2" />
                  Sobre
                </Link>
              </motion.div>
              
              <motion.div variants={navItemVariants}>
                <Link href="/ministries" className={`flex items-center py-2 px-2 rounded ${location === '/ministries' ? 'text-primary font-semibold' : 'text-gray-700'} hover:bg-gray-100`}>
                  <FiUsers className="mr-2" />
                  Ministérios
                </Link>
              </motion.div>
              
              <motion.div variants={navItemVariants}>
                <Link href="/calendar" className={`flex items-center py-2 px-2 rounded ${location === '/calendar' ? 'text-primary font-semibold' : 'text-gray-700'} hover:bg-gray-100`}>
                  <FiCalendar className="mr-2" />
                  Agenda
                </Link>
              </motion.div>
              
              <motion.div variants={navItemVariants}>
                <Link href="/downloads" className={`flex items-center py-2 px-2 rounded ${location === '/downloads' ? 'text-primary font-semibold' : 'text-gray-700'} hover:bg-gray-100`}>
                  <FiDownload className="mr-2" />
                  Downloads
                </Link>
              </motion.div>
              
              <motion.div variants={navItemVariants}>
                <Link href="/contact" className={`flex items-center py-2 px-2 rounded ${location === '/contact' ? 'text-primary font-semibold' : 'text-gray-700'} hover:bg-gray-100`}>
                  <FiMail className="mr-2" />
                  Contato
                </Link>
              </motion.div>
              
              <motion.div variants={navItemVariants} className="pt-2 border-t border-gray-200">
                {user ? (
                  <div className="space-y-2">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link href="/dashboard">
                        <Button variant="secondary" className="w-full justify-start">
                          <FiGrid className="mr-2" />
                          Meu Painel
                        </Button>
                      </Link>
                    </motion.div>
                    
                    {user.role === 'admin' && (
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link href="/admin">
                          <Button variant="secondary" className="w-full justify-start bg-amber-500 hover:bg-amber-600 text-white">
                            <FiSettings className="mr-2" />
                            Administração
                          </Button>
                        </Link>
                      </motion.div>
                    )}
                    
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                      >
                        {logoutMutation.isPending ? (
                          <div className="flex items-center">
                            <FiRefreshCw className="mr-2 animate-spin" />
                            <span>Saindo...</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <FiLogOut className="mr-2" />
                            <span>Sair</span>
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                ) : (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link href="/auth" className="block w-full">
                      <Button className="w-full bg-primary hover:bg-blue-700 text-white flex items-center justify-center">
                        <FiLogIn className="mr-2" />
                        <span>Entrar</span>
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
