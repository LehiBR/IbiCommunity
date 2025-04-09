import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { AuthProvider } from "@/hooks/use-auth";

// Layout
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Public routes
import Home from "@/pages/Home";
import About from "@/pages/About";
import Ministries from "@/pages/Ministries";
import Calendar from "@/pages/Calendar";
import Downloads from "@/pages/Downloads";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/AuthPage";
import ResetPassword from "@/pages/ResetPassword";

// Protected routes
import { ProtectedRoute } from "./lib/protected-route";
import Dashboard from "@/pages/Dashboard";
import Forum from "@/pages/Forum";
import BibleStudy from "@/pages/BibleStudy";
import Photos from "@/pages/Photos";
import ProfilePage from "@/pages/ProfilePage";

function AppRouter() {
  const [location] = useLocation();
  const { toast } = useToast();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Show page title in document title
  useEffect(() => {
    let title = "Igreja Batista Independente de Parnaíba";
    const path = location.split("/")[1];
    
    if (path) {
      const routeTitles: Record<string, string> = {
        about: "Sobre Nós",
        ministries: "Ministérios",
        calendar: "Agenda",
        downloads: "Downloads",
        contact: "Contato",
        auth: "Entrar",
        dashboard: "Meu Painel",
        profile: "Meu Perfil",
        forum: "Fórum",
        biblestudy: "Estudos Bíblicos",
        photos: "Galeria de Fotos"
      };
      
      if (routeTitles[path]) {
        title = `${routeTitles[path]} | ${title}`;
      }
    }
    
    document.title = title;
  }, [location]);

  // Check if we're on a protected page that should not show the navbar/footer
  const isProtectedPage = location.startsWith('/dashboard');

  return (
    <>
      {!isProtectedPage && <Header />}
      
      <main className="min-h-screen">
        <Switch>
          {/* Public Routes */}
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/ministries" component={Ministries} />
          <Route path="/calendar" component={Calendar} />
          <Route path="/downloads" component={Downloads} />
          <Route path="/contact" component={Contact} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/reset-password" component={ResetPassword} />
          
          {/* Protected Routes */}
          <ProtectedRoute path="/dashboard" component={Dashboard} />
          <ProtectedRoute path="/profile" component={ProfilePage} />
          <ProtectedRoute path="/forum" component={Forum} />
          <ProtectedRoute path="/forum/:id" component={Forum} />
          <ProtectedRoute path="/biblestudy" component={BibleStudy} />
          <ProtectedRoute path="/photos" component={Photos} />
          
          {/* Not Found */}
          <Route component={NotFound} />
        </Switch>
      </main>
      
      {!isProtectedPage && <Footer />}
      
      <Toaster />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
