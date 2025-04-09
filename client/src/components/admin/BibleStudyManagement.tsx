import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BibleStudyForm } from "./forms/BibleStudyForm";
import { Loader2, Eye, Pencil, Plus, Trash2, ExternalLink } from "lucide-react";

interface BibleStudyResource {
  id: number;
  title: string;
  description: string | null;
  contentType: string;
  resourceUrl: string;
  thumbnailUrl: string | null;
  category: string;
  authorId: number;
  isPublished: boolean;
  createdAt: string;
  viewCount: number;
  author?: {
    name: string;
  };
}

export function BibleStudyManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Estados locais
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [viewItem, setViewItem] = useState<{ type: string; data: any } | null>(null);
  const [editItem, setEditItem] = useState<{ type: string; data: any } | null>(null);
  const [createFormOpen, setCreateFormOpen] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<{id: number} | null>(null);

  // Buscar estudos
  const { data: studies, isLoading: isLoadingStudies } = useQuery({
    queryKey: ["/api/bible-study"],
    retry: 1,
  });

  // Buscar categorias únicas
  const categories = studies ? 
    ["todos", ...new Set(studies.map((study: BibleStudyResource) => study.category))] : 
    ["todos"];
  
  // Filtrar estudos
  const filteredStudies = studies ? 
    studies
      .filter((study: BibleStudyResource) => 
        study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (study.description && study.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .filter((study: BibleStudyResource) => 
        selectedCategory === "todos" || study.category === selectedCategory
      ) : 
    [];

  // Mutação para deletar estudo
  const deleteStudyMutation = useMutation({
    mutationFn: async (id: number) => {
      return fetch(`/api/bible-study/${id}`, {
        method: "DELETE",
      }).then(res => {
        if (!res.ok) throw new Error("Falha ao excluir o estudo");
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bible-study"] });
      toast({
        title: "Estudo excluído",
        description: "O estudo foi excluído com sucesso.",
      });
      setConfirmDelete(null);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o estudo.",
        variant: "destructive",
      });
    }
  });

  // Ação para confirmar exclusão
  const confirmDeleteAction = () => {
    if (confirmDelete) {
      deleteStudyMutation.mutate(confirmDelete.id);
    }
  };

  // Botão de exclusão
  const handleDelete = (id: number) => {
    setConfirmDelete({ id });
  };

  // Ver detalhes
  const viewDetails = (item: any) => {
    setViewItem({ type: "study", data: item });
  };
  
  // Editar estudo
  const handleEdit = (item: any) => {
    setEditItem({ type: "study", data: item });
  };
  
  // Criar novo estudo
  const handleCreateNew = () => {
    setCreateFormOpen(true);
  };
  
  // Callback após sucesso no formulário
  const handleFormSuccess = () => {
    setCreateFormOpen(false);
    setEditItem(null);
  };
  
  // Renderizar estado de carregamento
  const renderLoading = () => (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  // Obter ícone para tipo de conteúdo
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <Badge variant="outline">PDF</Badge>;
      case "video":
        return <Badge variant="outline">Vídeo</Badge>;
      case "audio":
        return <Badge variant="outline">Áudio</Badge>;
      case "text":
        return <Badge variant="outline">Texto</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Estudos Bíblicos</CardTitle>
          <CardDescription>
            Crie e gerencie estudos bíblicos, sermões e materiais de ensino.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="w-full sm:w-1/2">
                <Label htmlFor="search" className="sr-only">Buscar</Label>
                <Input
                  id="search"
                  placeholder="Buscar estudos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-1/2 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-end mb-4">
              <Button onClick={handleCreateNew}>
                <Plus className="w-4 h-4 mr-2" />
                Novo estudo
              </Button>
            </div>
            
            {isLoadingStudies ? renderLoading() : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Visualizações</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Nenhum estudo encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudies.map((study: BibleStudyResource) => (
                      <TableRow key={study.id}>
                        <TableCell className="font-medium">{study.title}</TableCell>
                        <TableCell>{study.category}</TableCell>
                        <TableCell>{getContentTypeIcon(study.contentType)}</TableCell>
                        <TableCell>
                          <Badge variant={study.isPublished ? "default" : "outline"}>
                            {study.isPublished ? "Publicado" : "Rascunho"}
                          </Badge>
                        </TableCell>
                        <TableCell>{study.viewCount}</TableCell>
                        <TableCell>{new Date(study.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => viewDetails(study)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => handleEdit(study)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => handleDelete(study.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Confirm Delete Dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este estudo? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteAction}
              disabled={deleteStudyMutation.isPending}
            >
              {deleteStudyMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Item Dialog */}
      <Dialog open={!!viewItem} onOpenChange={(open) => !open && setViewItem(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Estudo</DialogTitle>
          </DialogHeader>
          
          {viewItem && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{viewItem.data.title}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Categoria</p>
                  <p>{viewItem.data.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de Conteúdo</p>
                  <p>{viewItem.data.contentType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p>{viewItem.data.isPublished ? "Publicado" : "Rascunho"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data de Criação</p>
                  <p>{new Date(viewItem.data.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Visualizações</p>
                  <p>{viewItem.data.viewCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Recurso</p>
                  <div className="flex items-center">
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="p-0 h-auto"
                      onClick={() => window.open(viewItem.data.resourceUrl, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Abrir
                    </Button>
                  </div>
                </div>
              </div>
              
              {viewItem.data.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Descrição</p>
                  <p className="mt-1">{viewItem.data.description}</p>
                </div>
              )}
              
              {viewItem.data.thumbnailUrl && (
                <div>
                  <p className="text-sm text-muted-foreground">Imagem de Miniatura</p>
                  <div className="mt-2 w-32 h-32 overflow-hidden rounded border">
                    <img
                      src={viewItem.data.thumbnailUrl}
                      alt="Miniatura"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Fechar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create Study Dialog */}
      <Dialog open={createFormOpen} onOpenChange={(open) => !open && setCreateFormOpen(false)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Novo Estudo Bíblico</DialogTitle>
            <DialogDescription>
              Criar um novo estudo ou material de ensino.
            </DialogDescription>
          </DialogHeader>
          
          <BibleStudyForm onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>
      
      {/* Edit Study Dialog */}
      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Estudo Bíblico</DialogTitle>
            <DialogDescription>
              Modificar um estudo existente.
            </DialogDescription>
          </DialogHeader>
          
          {editItem && <BibleStudyForm study={editItem.data} onSuccess={handleFormSuccess} />}
        </DialogContent>
      </Dialog>
    </>
  );
}