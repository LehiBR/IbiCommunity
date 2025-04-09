import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Hero from "@/components/home/Hero";
import NewsCard from "@/components/home/NewsCard";
import BibleQuote from "@/components/home/BibleQuote";
import { useAuth } from "@/hooks/use-auth";
import type { Post } from "@shared/schema";

const Home = () => {
  const { user } = useAuth();
  
  // Fetch latest news posts
  const { data: latestPosts, isLoading } = useQuery<(Post & { author: { name: string } })[]>({
    queryKey: ["/api/posts", "latest"],
    queryFn: async () => {
      const res = await fetch("/api/posts?limit=3");
      if (!res.ok) throw new Error("Failed to fetch posts");
      return await res.json();
    }
  });

  // Bible quote for the center section
  const bibleQuote = {
    text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
    reference: "João 3:16",
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero />
      
      {/* Latest Updates Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="section-title">Últimas Atualizações</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading skeleton
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="h-48 bg-gray-200 animate-pulse"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-4 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                    </div>
                  </div>
                ))
            ) : latestPosts && latestPosts.length > 0 ? (
              latestPosts.map((post) => (
                <NewsCard key={post.id} post={post} />
              ))
            ) : (
              <div className="col-span-3 text-center">
                <p className="text-gray-500">Nenhuma atualização disponível no momento.</p>
              </div>
            )}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/dashboard">
              <Button className="btn-primary btn-icon">
                Ver Todas as Notícias
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="ml-2 h-5 w-5" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Bible Quote */}
      <BibleQuote quote={bibleQuote} />

      {/* Member Login CTA */}
      {!user && (
        <section className="py-16 px-4 bg-primary text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 font-heading">
              Acesso para Membros
            </h2>
            <p className="text-lg max-w-2xl mx-auto mb-8">
              Faça login para acessar conteúdos exclusivos, participar do fórum da
              igreja e ficar por dentro de todas as atividades.
            </p>
            <Link href="/auth">
              <Button className="bg-white text-primary hover:bg-gray-100 font-bold px-8 py-3 rounded-md transition text-lg">
                Entrar / Cadastrar
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
