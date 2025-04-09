import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogClose
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Post {
  id: number;
  title: string;
  createdAt: string;
  category: string;
  isPublished: boolean;
  author?: {
    name: string;
  };
}

interface Event {
  id: number;
  title: string;
  category: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

interface Resource {
  id: number;
  title: string;
  category: string;
  fileType: string;
  isPublic: boolean;
  createdAt: string;
}

interface ForumPost {
  id: number;
  title: string;
  category: string;
  createdAt: string;
  author?: {
    name: string;
  };
  commentCount: number;
}

export function ContentManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("posts");
  const [confirmDelete, setConfirmDelete] = useState<{ type: string; id: number } | null>(null);
  const [viewItem, setViewItem] = useState<any | null>(null);
  
  // Fetch posts
  const { data: posts, isLoading: isLoadingPosts } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
    onError: () => {
      toast({
        title: "Erro ao carregar postagens",
        description: "Não foi possível carregar a lista de postagens.",
        variant: "destructive"
      });
    }
  });
  
  // Fetch events
  const { data: events, isLoading: isLoadingEvents } = useQuery<Event[]>({
    queryKey: ['/api/events'],
    onError: () => {
      toast({
        title: "Erro ao carregar eventos",
        description: "Não foi possível carregar a lista de eventos.",
        variant: "destructive"
      });
    }
  });
  
  // Fetch resources
  const { data: resources, isLoading: isLoadingResources } = useQuery<Resource[]>({
    queryKey: ['/api/resources'],
    onError: () => {
      toast({
        title: "Erro ao carregar recursos",
        description: "Não foi possível carregar a lista de recursos.",
        variant: "destructive"
      });
    }
  });
  
  // Fetch forum posts
  const { data: forumPosts, isLoading: isLoadingForumPosts } = useQuery<ForumPost[]>({
    queryKey: ['/api/forum'],
    onError: () => {
      toast({
        title: "Erro ao carregar tópicos do fórum",
        description: "Não foi possível carregar a lista de tópicos.",
        variant: "destructive"
      });
    }
  });
  
  // Delete content mutation
  const deleteContentMutation = useMutation({
    mutationFn: async ({ type, id }: { type: string; id: number }) => {
      const apiPath = type === 'post' ? `/api/posts/${id}` : 
                      type === 'event' ? `/api/events/${id}` : 
                      type === 'resource' ? `/api/resources/${id}` : 
                      `/api/forum/${id}`;
                      
      return apiRequest(apiPath, {
        method: 'DELETE'
      });
    },
    onSuccess: (_, variables) => {
      const queryKey = variables.type === 'post' ? ['/api/posts'] : 
                        variables.type === 'event' ? ['/api/events'] : 
                        variables.type === 'resource' ? ['/api/resources'] : 
                        ['/api/forum'];
                        
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: "Conteúdo excluído",
        description: "O conteúdo foi excluído com sucesso."
      });
      setConfirmDelete(null);
    },
    onError: () => {
      toast({
        title: "Erro ao excluir conteúdo",
        description: "Não foi possível excluir o conteúdo.",
        variant: "destructive"
      });
    }
  });
  
  const handleDelete = (type: string, id: number) => {
    setConfirmDelete({ type, id });
  };
  
  const confirmDeleteAction = () => {
    if (confirmDelete) {
      deleteContentMutation.mutate(confirmDelete);
    }
  };
  
  const viewDetails = (type: string, item: any) => {
    setViewItem({ type, data: item });
  };
  
  const renderLoading = () => (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Conteúdo</CardTitle>
          <CardDescription>
            Gerencie e modere todo o conteúdo criado pelos usuários.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="posts">Postagens</TabsTrigger>
              <TabsTrigger value="events">Eventos</TabsTrigger>
              <TabsTrigger value="resources">Recursos</TabsTrigger>
              <TabsTrigger value="forum">Fórum</TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts" className="mt-4">
              {isLoadingPosts ? renderLoading() : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Autor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts?.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>{post.category}</TableCell>
                        <TableCell>{post.author?.name || "Desconhecido"}</TableCell>
                        <TableCell>
                          <Badge variant={post.isPublished ? "default" : "outline"}>
                            {post.isPublished ? "Publicado" : "Rascunho"}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(post.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => viewDetails('post', post)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => handleDelete('post', post.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            
            <TabsContent value="events" className="mt-4">
              {isLoadingEvents ? renderLoading() : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Data Início</TableHead>
                      <TableHead>Data Fim</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events?.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{event.category}</TableCell>
                        <TableCell>{new Date(event.startDate).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>{new Date(event.endDate).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>{new Date(event.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => viewDetails('event', event)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => handleDelete('event', event.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            
            <TabsContent value="resources" className="mt-4">
              {isLoadingResources ? renderLoading() : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Acesso</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resources?.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell className="font-medium">{resource.title}</TableCell>
                        <TableCell>{resource.category}</TableCell>
                        <TableCell>{resource.fileType}</TableCell>
                        <TableCell>
                          <Badge variant={resource.isPublic ? "default" : "outline"}>
                            {resource.isPublic ? "Público" : "Privado"}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(resource.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => viewDetails('resource', resource)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => handleDelete('resource', resource.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            
            <TabsContent value="forum" className="mt-4">
              {isLoadingForumPosts ? renderLoading() : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Autor</TableHead>
                      <TableHead>Comentários</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {forumPosts?.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>{post.category}</TableCell>
                        <TableCell>{post.author?.name || "Desconhecido"}</TableCell>
                        <TableCell>{post.commentCount}</TableCell>
                        <TableCell>{new Date(post.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => viewDetails('forum', post)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => handleDelete('forum', post.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Confirm Delete Dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteAction}
              disabled={deleteContentMutation.isPending}
            >
              {deleteContentMutation.isPending ? (
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
            <DialogTitle>Detalhes do Item</DialogTitle>
          </DialogHeader>
          
          {viewItem && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{viewItem.data.title}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(viewItem.data).map(([key, value]) => {
                  // Skip nested objects, arrays and functions for display
                  if (key === 'title' || typeof value === 'object' || typeof value === 'function') {
                    return null;
                  }
                  
                  let displayValue = value;
                  if (key.includes('Date')) {
                    displayValue = new Date(value as string).toLocaleDateString('pt-BR');
                  } else if (typeof value === 'boolean') {
                    displayValue = value ? 'Sim' : 'Não';
                  }
                  
                  return (
                    <div key={key}>
                      <p className="text-sm text-muted-foreground">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </p>
                      <p>{displayValue as React.ReactNode}</p>
                    </div>
                  );
                })}
              </div>
              
              {viewItem.data.content && (
                <div>
                  <p className="text-sm text-muted-foreground">Conteúdo</p>
                  <p className="mt-1">{viewItem.data.content}</p>
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
    </>
  );
}