import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { BibleStudyResource } from "@shared/schema";
import { Download, FileText, Video, BookText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StudyResourceProps {
  resource: BibleStudyResource;
}

// Componente para exibir um recurso de estudo bíblico
const StudyResourceItem = ({ resource }: StudyResourceProps) => {
  // Define o ícone com base no tipo de conteúdo
  const getIcon = () => {
    switch (resource.contentType) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-blue-500" />;
      case 'activity':
        return <BookText className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-shrink-0">
        {resource.thumbnailUrl ? (
          <img 
            src={resource.thumbnailUrl} 
            alt={resource.title} 
            className="w-16 h-16 object-cover rounded-md"
          />
        ) : (
          <div className="w-16 h-16 flex items-center justify-center rounded-md bg-gray-100">
            {getIcon()}
          </div>
        )}
      </div>
      
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-medium truncate">{resource.title}</h3>
          <Badge variant={
            resource.contentType === 'pdf' ? 'destructive' : 
            resource.contentType === 'video' ? 'default' : 'outline'
          }>
            {resource.contentType.toUpperCase()}
          </Badge>
        </div>
        
        {resource.description && (
          <p className="text-gray-600 text-sm line-clamp-2">{resource.description}</p>
        )}
        
        <div className="flex items-center gap-4 mt-2">
          <span className="text-xs text-gray-500">
            {new Date(resource.createdAt).toLocaleDateString('pt-BR')}
          </span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <BookText className="h-3 w-3" /> {resource.viewCount} visualizações
          </span>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="flex-shrink-0 whitespace-nowrap"
        onClick={() => window.open(resource.resourceUrl, '_blank')}
      >
        <Download className="h-4 w-4 mr-1" />
        {resource.contentType === 'video' ? 'Assistir' : 'Baixar'}
      </Button>
    </div>
  );
};

const BibleStudy = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // Buscar todos os recursos de estudo bíblico
  const { data: bibleResources, isLoading } = useQuery<BibleStudyResource[]>({
    queryKey: ["/api/bible-study-resources"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/bible-study-resources");
        if (!res.ok) throw new Error("Falha ao carregar recursos de estudo bíblico");
        return await res.json();
      } catch (error) {
        toast({
          title: "Erro ao carregar recursos",
          description: "Ocorreu um erro ao carregar os recursos de estudo bíblico.",
          variant: "destructive",
        });
        throw error;
      }
    }
  });

  // Filtrar recursos com base na aba selecionada
  const filteredResources = bibleResources?.filter(resource => {
    // Filtrar por tipo de conteúdo
    if (activeTab !== "all" && resource.contentType !== activeTab) {
      return false;
    }
    
    // Filtrar por categoria
    if (categoryFilter && resource.category !== categoryFilter) {
      return false;
    }
    
    return true;
  }) || [];

  // Obter categorias únicas para o filtro
  const categories: string[] = [];
  if (bibleResources && bibleResources.length > 0) {
    const categorySet = new Set<string>();
    for (const resource of bibleResources) {
      if (resource.category) {
        categorySet.add(resource.category);
      }
    }
    // Converter o Set para Array
    categories.push(...Array.from(categorySet));
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Estudos Bíblicos</h1>
          <p className="text-gray-600">
            Acesse materiais de estudo, vídeos e atividades para aprofundar seu conhecimento bíblico.
          </p>
        </div>

        {/* Filtros para tipo de conteúdo */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-4 mb-2">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="pdf">PDFs</TabsTrigger>
            <TabsTrigger value="video">Vídeos</TabsTrigger>
            <TabsTrigger value="activity">Atividades</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filtros para categoria */}
        {categories.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Filtrar por categoria:</h3>
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant={categoryFilter === null ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setCategoryFilter(null)}
              >
                Todas
              </Badge>
              {categories.map(category => (
                <Badge 
                  key={category} 
                  variant={categoryFilter === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setCategoryFilter(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Lista de recursos */}
        <Card>
          <CardHeader>
            <CardTitle>Recursos de Estudo Bíblico</CardTitle>
            <CardDescription>
              Materiais para seu crescimento espiritual e conhecimento bíblico
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 border rounded-lg animate-pulse">
                    <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
                    <div className="flex-grow">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                    <div className="w-24 h-8 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredResources.length > 0 ? (
              <div className="space-y-4">
                {filteredResources.map(resource => (
                  <StudyResourceItem key={resource.id} resource={resource} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum recurso encontrado</h3>
                <p className="text-gray-500">
                  {categoryFilter || activeTab !== "all" ? 
                    "Tente mudar os filtros de busca para ver mais resultados." : 
                    "Novos recursos serão adicionados em breve."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
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
