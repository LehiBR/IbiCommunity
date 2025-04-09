import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, ImagePlus } from "lucide-react";
import { motion } from "framer-motion";

// Schema para validação do formulário
const postSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  content: z.string().min(10, "O conteúdo deve ter pelo menos 10 caracteres"),
  category: z.string().min(1, "Categoria é obrigatória"),
  isPublished: z.boolean().default(false),
  imageUrl: z.string().nullable().optional(),
});

// Tipo para os dados do formulário
type PostFormData = z.infer<typeof postSchema>;

// Props do componente
interface PostFormProps {
  post?: PostFormData & { id?: number };
  onSuccess?: () => void;
}

export function PostForm({ post, onSuccess }: PostFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(post?.imageUrl || null);
  const [isUploading, setIsUploading] = useState(false);

  // Configuração do formulário
  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      category: post?.category || "notícias",
      isPublished: post?.isPublished !== undefined ? post?.isPublished : false,
      imageUrl: post?.imageUrl || null,
    },
  });

  // Mutação para criar/editar post
  const postMutation = useMutation({
    mutationFn: async (data: PostFormData) => {
      if (post?.id) {
        // Edição
        return apiRequest(`/api/posts/${post.id}`, {
          method: "PUT",
          data: data,
        });
      } else {
        // Criação
        return apiRequest("/api/posts", {
          method: "POST",
          data: data,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: post?.id ? "Post atualizado" : "Post criado",
        description: post?.id
          ? "O post foi atualizado com sucesso."
          : "O post foi criado com sucesso.",
      });
      form.reset();
      setImagePreview(null);
      if (onSuccess) onSuccess();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o post.",
        variant: "destructive",
      });
    },
  });

  // Função para upload de imagem
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Formato inválido",
        description: "Por favor, envie uma imagem nos formatos: JPG, PNG, GIF ou WebP.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Criar FormData
      const formData = new FormData();
      formData.append("image", file);

      // Enviar para o endpoint de upload
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Falha no upload da imagem");
      }

      const data = await response.json();
      
      // Adicionar URL da imagem ao formulário
      form.setValue("imageUrl", data.url);
      setImagePreview(data.url);

      toast({
        title: "Upload concluído",
        description: "A imagem foi enviada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Não foi possível enviar a imagem.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Submit do formulário
  const onSubmit = (data: PostFormData) => {
    postMutation.mutate(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              {...form.register("title")}
              placeholder="Digite o título do post"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="category">Categoria</Label>
            <Input
              id="category"
              {...form.register("category")}
              placeholder="Ex: notícias, eventos, devocionais"
            />
            {form.formState.errors.category && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.category.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea
              id="content"
              {...form.register("content")}
              rows={8}
              placeholder="Digite o conteúdo do post aqui..."
            />
            {form.formState.errors.content && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.content.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="image" className="block mb-2">
              Imagem de capa
            </Label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("image")?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <ImagePlus className="w-4 h-4 mr-2" />
                      {imagePreview ? "Alterar imagem" : "Escolher imagem"}
                    </>
                  )}
                </Button>
              </div>
              
              {imagePreview && (
                <div className="relative w-16 h-16 overflow-hidden rounded border">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPublished"
              checked={form.watch("isPublished")}
              onCheckedChange={(checked) =>
                form.setValue("isPublished", checked)
              }
            />
            <Label htmlFor="isPublished">Publicar</Label>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={postMutation.isPending}
            className="w-full md:w-auto"
          >
            {postMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : post?.id ? (
              "Atualizar Post"
            ) : (
              "Criar Post"
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}