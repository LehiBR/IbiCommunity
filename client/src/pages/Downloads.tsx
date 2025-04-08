import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ResourceItem from "@/components/downloads/ResourceItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Resource } from "@shared/schema";

// Resource categories
const CATEGORIES = [
  { value: "all", label: "Todos" },
  { value: "bulletin", label: "Boletins" },
  { value: "study", label: "Estudos" },
  { value: "music", label: "Música" },
  { value: "calendar", label: "Calendários" }
];

const Downloads = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Fetch resources
  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ["/api/resources", activeCategory],
    queryFn: async () => {
      const categoryParam = activeCategory !== "all" ? `&category=${activeCategory}` : "";
      const res = await fetch(`/api/resources?${categoryParam}`);
      if (!res.ok) throw new Error("Failed to fetch resources");
      return await res.json();
    }
  });

  return (
    <div>
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-primary">
            Downloads e Recursos
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-center text-gray-600 mb-8">
              Acesse e baixe materiais úteis para sua caminhada cristã, 
              incluindo estudos bíblicos, boletins e músicas.
            </p>
          </div>
        </div>
      </section>

      <section id="downloads" className="py-12 px-4 bg-neutral-light">
        <div className="container mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold mb-6 font-heading text-primary">
              Materiais Disponíveis
            </h3>
            
            <Tabs 
              defaultValue="all" 
              value={activeCategory}
              onValueChange={setActiveCategory}
              className="w-full"
            >
              <TabsList className="mb-6 flex flex-wrap">
                {CATEGORIES.map(category => (
                  <TabsTrigger 
                    key={category.value} 
                    value={category.value}
                    className="px-4 py-2"
                  >
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {CATEGORIES.map(category => (
                <TabsContent key={category.value} value={category.value}>
                  {isLoading ? (
                    // Loading skeleton
                    <div className="space-y-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between border-b pb-4 animate-pulse">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                            <div>
                              <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded w-32"></div>
                            </div>
                          </div>
                          <div className="w-20 h-8 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : resources && resources.length > 0 ? (
                    <div className="space-y-4">
                      {resources.map(resource => (
                        <ResourceItem key={resource.id} resource={resource} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <span className="material-icons text-gray-400 text-5xl mb-2">folder_open</span>
                      <p className="text-gray-500">Nenhum recurso disponível nesta categoria.</p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4 font-heading text-primary">Links Úteis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 border rounded-lg hover:bg-primary hover:text-white transition">
                <span className="material-icons mr-3">video_library</span>
                <span>Canal do YouTube</span>
              </a>
              <a href="https://www.spotify.com" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 border rounded-lg hover:bg-primary hover:text-white transition">
                <span className="material-icons mr-3">podcasts</span>
                <span>Podcast de Sermões</span>
              </a>
              <a href="https://photos.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 border rounded-lg hover:bg-primary hover:text-white transition">
                <span className="material-icons mr-3">photo_library</span>
                <span>Galeria de Fotos</span>
              </a>
              <a href="#" className="flex items-center p-3 border rounded-lg hover:bg-primary hover:text-white transition">
                <span className="material-icons mr-3">book</span>
                <span>Biblioteca Virtual</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Downloads;
