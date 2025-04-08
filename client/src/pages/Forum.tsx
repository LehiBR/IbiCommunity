import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import ForumPost from "@/components/forum/ForumPost";
import CreatePost from "@/components/forum/CreatePost";
import type { ForumPost as ForumPostType, ForumComment } from "@shared/schema";

// Forum categories
const CATEGORIES = [
  { value: "all", label: "Todos os Tópicos" },
  { value: "general", label: "Geral" },
  { value: "bible", label: "Estudos Bíblicos" },
  { value: "prayer", label: "Pedidos de Oração" },
  { value: "testimony", label: "Testemunhos" },
  { value: "events", label: "Eventos" },
];

const Forum = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const params = useParams();
  const postId = params?.id ? parseInt(params.id) : undefined;
  
  const [category, setCategory] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [commentContent, setCommentContent] = useState("");

  // If we have a specific postId, fetch that post with its comments
  const {
    data: singlePost,
    isLoading: loadingSinglePost,
    error: singlePostError,
  } = useQuery<ForumPostType & { author: any; comments: (ForumComment & { author: any })[] }>({
    queryKey: ["/api/forum", postId],
    queryFn: async () => {
      if (!postId) throw new Error("No post ID provided");
      const res = await fetch(`/api/forum/${postId}`);
      if (!res.ok) throw new Error("Failed to fetch post");
      return await res.json();
    },
    enabled: !!postId,
  });

  // Otherwise, fetch the list of forum posts
  const {
    data: forumPosts,
    isLoading: loadingPosts,
    error: postsError,
  } = useQuery<(ForumPostType & { author: any; commentCount: number })[]>({
    queryKey: ["/api/forum", category],
    queryFn: async () => {
      const categoryParam = category !== "all" ? `&category=${category}` : "";
      const res = await fetch(`/api/forum?${categoryParam}`);
      if (!res.ok) throw new Error("Failed to fetch forum posts");
      return await res.json();
    },
    enabled: !postId,
  });

  // Mutation for adding a comment
  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", `/api/forum/${postId}/comments`, { content });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Comentário adicionado",
        description: "Seu comentário foi publicado com sucesso.",
      });
      setCommentContent("");
      queryClient.invalidateQueries({ queryKey: ["/api/forum", postId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao adicionar comentário",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle comment submission
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) {
      toast({
        title: "Erro",
        description: "O comentário não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }
    addCommentMutation.mutate(commentContent);
  };

  // Show error if anything fails
  useEffect(() => {
    if (singlePostError) {
      toast({
        title: "Erro ao carregar tópico",
        description: (singlePostError as Error).message,
        variant: "destructive",
      });
      setLocation("/forum");
    }
    
    if (postsError) {
      toast({
        title: "Erro ao carregar fórum",
        description: (postsError as Error).message,
        variant: "destructive",
      });
    }
  }, [singlePostError, postsError, toast, setLocation]);

  // If viewing a single post
  if (postId) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6 flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => setLocation("/forum")}
              className="mr-2"
            >
              <span className="material-icons mr-1">arrow_back</span>
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-primary">Fórum</h1>
          </div>

          {loadingSinglePost ? (
            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-7 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-5 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ) : singlePost ? (
            <>
              {/* Single post view */}
              <ForumPost 
                post={singlePost} 
                isDetailView={true} 
              />
              
              {/* Comments section */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-6">
                  Comentários ({singlePost.comments?.length || 0})
                </h3>
                
                {singlePost.comments?.length > 0 ? (
                  <div className="space-y-6">
                    {singlePost.comments.map((comment) => (
                      <Card key={comment.id}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                                {comment.author?.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <CardTitle className="text-base">{comment.author?.name}</CardTitle>
                                <CardDescription>
                                  {new Date(comment.createdAt).toLocaleDateString("pt-BR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })}
                                </CardDescription>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p>{comment.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">
                      Nenhum comentário ainda. Seja o primeiro a comentar!
                    </p>
                  </div>
                )}
                
                {/* Add comment form */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-xl">Adicionar Comentário</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCommentSubmit}>
                      <Textarea
                        placeholder="Escreva seu comentário..."
                        className="resize-none mb-4"
                        rows={4}
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        required
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={addCommentMutation.isPending}
                      >
                        {addCommentMutation.isPending ? (
                          <span className="material-icons animate-spin mr-2">autorenew</span>
                        ) : (
                          <span className="material-icons mr-2">send</span>
                        )}
                        Enviar Comentário
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Tópico não encontrado.</p>
              <Button onClick={() => setLocation("/forum")} className="mt-4">
                Voltar para o Fórum
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Forum listing view
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Fórum da Igreja</h1>
            <p className="text-gray-600">
              Compartilhe ideias, testemunhos e participe das discussões com outros membros.
            </p>
          </div>
          <Button onClick={() => setShowCreateForm(true)}>
            <span className="material-icons mr-2">add</span>
            Novo Tópico
          </Button>
        </div>

        {/* Filter controls */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Input placeholder="Pesquisar tópicos..." />
          </div>
        </div>

        {/* Create Post Form Modal */}
        {showCreateForm && (
          <CreatePost 
            onClose={() => setShowCreateForm(false)} 
            categories={CATEGORIES.filter(cat => cat.value !== 'all')}
          />
        )}

        {/* Forum Posts */}
        <div className="space-y-6">
          {loadingPosts ? (
            // Loading skeleton
            [...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))
          ) : forumPosts && forumPosts.length > 0 ? (
            forumPosts.map(post => (
              <ForumPost key={post.id} post={post} isDetailView={false} />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 mb-4">
                Nenhum tópico encontrado nesta categoria.
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                Criar o Primeiro Tópico
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Forum;
