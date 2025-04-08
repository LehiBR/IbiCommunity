import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ResourceItem from "@/components/downloads/ResourceItem";
import type { Resource, Post } from "@shared/schema";

interface StudyVideoInfo {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  date: string;
  category: string;
}

const BibleStudy = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("materials");

  // Fetch study materials (PDFs, docs, etc)
  const { data: studyMaterials, isLoading: loadingMaterials } = useQuery<Resource[]>({
    queryKey: ["/api/resources", "study"],
    queryFn: async () => {
      const res = await fetch("/api/resources?category=study");
      if (!res.ok) throw new Error("Failed to fetch study materials");
      return await res.json();
    }
  });

  // Fetch Bible studies posts
  const { data: studyPosts, isLoading: loadingPosts } = useQuery<Post[]>({
    queryKey: ["/api/posts", "bible-study"],
    queryFn: async () => {
      const res = await fetch("/api/posts?category=bible-study");
      if (!res.ok) throw new Error("Failed to fetch Bible study posts");
      return await res.json();
    }
  });

  // Fetch video studies
  const { data: studyVideos, isLoading: loadingVideos } = useQuery<StudyVideoInfo[]>({
    queryKey: ["/api/bible-videos"],
    queryFn: async () => {
      // This would be an API call in a real implementation
      // Returning structured video data for now
      return [
        {
          id: 1,
          title: "Estudando o Livro de Romanos - Parte 1",
          description: "Uma introdução ao livro de Romanos e seu contexto histórico.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          date: "2023-07-15",
          category: "new-testament"
        },
        {
          id: 2,
          title: "Os Salmos e sua Aplicação Hoje",
          description: "Como os Salmos podem guiar nossa adoração e oração.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          date: "2023-06-28",
          category: "old-testament"
        },
        {
          id: 3,
          title: "Parábolas de Jesus - O Bom Samaritano",
          description: "Análise da parábola do Bom Samaritano e seus ensinamentos.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          date: "2023-08-02", 
          category: "new-testament"
        }
      ];
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Estudos Bíblicos</h1>
          <p className="text-gray-600">
            Acesse materiais de estudo, vídeos e devocionals para aprofundar seu conhecimento bíblico.
          </p>
        </div>

        <Tabs defaultValue="materials" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="materials">Materiais</TabsTrigger>
            <TabsTrigger value="videos">Vídeos</TabsTrigger>
            <TabsTrigger value="articles">Artigos</TabsTrigger>
          </TabsList>
          
          {/* Materials Tab */}
          <TabsContent value="materials">
            <Card>
              <CardHeader>
                <CardTitle>Materiais de Estudo</CardTitle>
                <CardDescription>
                  PDFs, documentos e recursos para estudo individual ou em grupo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingMaterials ? (
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
                ) : studyMaterials && studyMaterials.length > 0 ? (
                  <div className="space-y-4">
                    {studyMaterials.map(resource => (
                      <ResourceItem key={resource.id} resource={resource} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <span className="material-icons text-gray-400 text-5xl mb-2">menu_book</span>
                    <p className="text-gray-500">Nenhum material de estudo disponível no momento.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Videos Tab */}
          <TabsContent value="videos">
            <Card>
              <CardHeader>
                <CardTitle>Vídeos de Estudo</CardTitle>
                <CardDescription>
                  Pregações e estudos em formato de vídeo para você assistir online.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingVideos ? (
                  <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-48 bg-gray-200 rounded-lg mb-3"></div>
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                      </div>
                    ))}
                  </div>
                ) : studyVideos && studyVideos.length > 0 ? (
                  <div className="space-y-6">
                    {studyVideos.map(video => (
                      <div key={video.id} className="border-b pb-6 last:border-0 last:pb-0">
                        <div className="aspect-video mb-3 overflow-hidden rounded-lg">
                          <iframe
                            width="100%"
                            height="100%"
                            src={video.videoUrl}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                        <h3 className="text-lg font-semibold mb-1">{video.title}</h3>
                        <p className="text-gray-600 mb-2">{video.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="material-icons text-sm mr-1">calendar_today</span>
                          <span>{new Date(video.date).toLocaleDateString("pt-BR")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <span className="material-icons text-gray-400 text-5xl mb-2">videocam</span>
                    <p className="text-gray-500">Nenhum vídeo disponível no momento.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Articles Tab */}
          <TabsContent value="articles">
            <Card>
              <CardHeader>
                <CardTitle>Artigos e Devocionais</CardTitle>
                <CardDescription>
                  Textos para reflexão e crescimento espiritual.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingPosts ? (
                  <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse border-b pb-6">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : studyPosts && studyPosts.length > 0 ? (
                  <div className="space-y-6">
                    {studyPosts.map(post => (
                      <div key={post.id} className="border-b pb-6 last:border-0 last:pb-0">
                        <h3 className="text-xl font-semibold mb-1">{post.title}</h3>
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <span className="material-icons text-sm mr-1">calendar_today</span>
                          <span>{new Date(post.createdAt).toLocaleDateString("pt-BR")}</span>
                          <span className="mx-2">•</span>
                          <span>{(post as any).author?.name || "Anônimo"}</span>
                        </div>
                        <p className="text-gray-600 mb-4">
                          {post.content.length > 200 
                            ? post.content.substring(0, 200) + "..." 
                            : post.content}
                        </p>
                        <Button variant="outline" size="sm">
                          Ler Mais
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <span className="material-icons text-gray-400 text-5xl mb-2">article</span>
                    <p className="text-gray-500">Nenhum artigo disponível no momento.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Weekly verse */}
        <Card className="mt-8 bg-primary text-white">
          <CardHeader>
            <CardTitle>Versículo da Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="bible-quote text-xl">
              "Porque pela graça sois salvos, por meio da fé; e isto não vem de vós, é dom de Deus."
            </blockquote>
            <footer className="mt-4 text-right font-medium">
              — Efésios 2:8
            </footer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BibleStudy;
