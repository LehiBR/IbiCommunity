import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Search, FileText, Video, Music, FileQuestion, Filter, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function BibleStudy() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [selectedType, setSelectedType] = useState("todos");
  
  // Fetch estudos bíblicos
  const { data: studies, isLoading, error } = useQuery({
    queryKey: ["/api/bible-study-resources"], 
    retry: 1,
  });

  // Filtrar por categoria e tipo
  const filteredStudies = studies
    ? studies
        .filter((study: any) => study.isPublished)
        .filter((study: any) => 
          searchTerm === "" || 
          study.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          (study.description && study.description.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .filter((study: any) => 
          selectedCategory === "todos" || study.category === selectedCategory
        )
        .filter((study: any) => 
          selectedType === "todos" || study.contentType === selectedType
        )
    : [];

  // Extrair categorias únicas
  const categories = studies
    ? ["todos", ...new Set(studies
        .filter((study: any) => study.isPublished)
        .map((study: any) => study.category))]
    : ["todos"];

  // Tipos de conteúdo
  const contentTypes = [
    { id: "todos", name: "Todos", icon: <Filter className="h-4 w-4" /> },
    { id: "pdf", name: "PDF", icon: <FileText className="h-4 w-4" /> },
    { id: "video", name: "Vídeo", icon: <Video className="h-4 w-4" /> },
    { id: "audio", name: "Áudio", icon: <Music className="h-4 w-4" /> },
    { id: "text", name: "Texto", icon: <BookOpen className="h-4 w-4" /> },
  ];

  // Atualizar contagem de visualizações ao abrir um recurso
  const viewResource = async (id: number, url: string) => {
    try {
      // Chamar endpoint para atualizar contagem de visualizações
      await fetch(`/api/bible-study/${id}/view`, {
        method: "POST",
      });
      
      // Abrir o recurso em uma nova aba
      window.open(url, "_blank");
    } catch (error) {
      console.error("Erro ao atualizar visualizações:", error);
      // Se falhar a atualização, ainda abre o recurso
      window.open(url, "_blank");
    }
  };

  // Obter ícone para tipo de conteúdo
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "audio":
        return <Music className="h-5 w-5" />;
      case "text":
        return <BookOpen className="h-5 w-5" />;
      default:
        return <FileQuestion className="h-5 w-5" />;
    }
  };

  // Animação para os cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  if (error) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Erro ao carregar recursos</h1>
        <p className="text-muted-foreground mb-6">
          Não foi possível carregar os estudos bíblicos. Por favor, tente novamente mais tarde.
        </p>
        <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Estudos Bíblicos</h1>
          <p className="text-muted-foreground">
            Acesse materiais de estudo, sermões, devocionais e recursos para o seu crescimento espiritual.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Pesquisa e filtros */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar estudos..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Tabs com categorias */}
          <div className="overflow-auto">
            <Tabs defaultValue="todos" value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="h-auto flex flex-nowrap overflow-x-auto p-0 bg-transparent space-x-2">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Filtro por tipo de conteúdo */}
          <div className="flex flex-wrap gap-2">
            {contentTypes.map((type) => (
              <Button
                key={type.id}
                variant={selectedType === type.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type.id)}
                className="flex items-center gap-1"
              >
                {type.icon}
                <span>{type.name}</span>
              </Button>
            ))}
          </div>

          <Separator />

          {/* Lista de estudos */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredStudies.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Nenhum estudo encontrado</h3>
              <p className="text-muted-foreground">
                Tente mudar os filtros ou a busca para encontrar mais resultados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudies.map((study: any, index: number) => (
                <motion.div
                  key={study.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                >
                  <Card className="overflow-hidden h-full flex flex-col">
                    {study.thumbnailUrl ? (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={study.thumbnailUrl}
                          alt={study.title}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        {getContentTypeIcon(study.contentType)}
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{study.title}</CardTitle>
                        <Badge variant="outline">{study.contentType}</Badge>
                      </div>
                      <CardDescription>
                        {study.category}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 flex-grow">
                      {study.description ? (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {study.description}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          Sem descrição disponível
                        </p>
                      )}
                    </CardContent>
                    <CardFooter>
                      <div className="w-full flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          {study.viewCount} visualizações
                        </span>
                        <Button 
                          size="sm"
                          onClick={() => viewResource(study.id, study.resourceUrl)}
                        >
                          Acessar
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}