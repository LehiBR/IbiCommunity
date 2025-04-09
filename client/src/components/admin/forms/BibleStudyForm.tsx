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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, FileUp, Link2 } from "lucide-react";
import { motion } from "framer-motion";

// Schema para validação do formulário
const bibleStudySchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().nullable().optional(),
  contentType: z.string().min(1, "Tipo de conteúdo é obrigatório"),
  resourceUrl: z.string().min(1, "URL do recurso é obrigatória"),
  thumbnailUrl: z.string().nullable().optional(),
  category: z.string().min(1, "Categoria é obrigatória"),
  isPublished: z.boolean().default(false),
});

// Tipo para os dados do formulário
type BibleStudyFormData = z.infer<typeof bibleStudySchema>;

// Props do componente
interface BibleStudyFormProps {
  study?: BibleStudyFormData & { id?: number };
  onSuccess?: () => void;
}

export function BibleStudyForm({ study, onSuccess }: BibleStudyFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [fileName, setFileName] = useState<string>(study?.thumbnailUrl ? "Imagem atual" : "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState<"image" | "link">("image");

  // Configuração do formulário
  const form = useForm<BibleStudyFormData>({
    resolver: zodResolver(bibleStudySchema),
    defaultValues: {
      title: study?.title || "",
      description: study?.description || "",
      contentType: study?.contentType || "pdf",
      resourceUrl: study?.resourceUrl || "",
      thumbnailUrl: study?.thumbnailUrl || null,
      category: study?.category || "estudos",
      isPublished: study?.isPublished !== undefined ? study?.isPublished : false,
    },
  });

  // Mutação para criar/editar estudo bíblico
  const studyMutation = useMutation({
    mutationFn: async (data: BibleStudyFormData) => {
      if (study?.id) {
        // Edição
        return apiRequest(`/api/bible-study/${study.id}`, {
          method: "PUT",
          data: data,
        });
      } else {
        // Criação
        return apiRequest("/api/bible-study", {
          method: "POST",
          data: data,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bible-study"] });
      toast({
        title: study?.id ? "Estudo atualizado" : "Estudo criado",
        description: study?.id
          ? "O estudo foi atualizado com sucesso."
          : "O estudo foi criado com sucesso.",
      });
      form.reset();
      setFileName("");
      if (onSuccess) onSuccess();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o estudo.",
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
    setFileName(file.name);

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
      form.setValue("thumbnailUrl", data.url);

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

  // Função para adicionar um arquivo de estudo
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Criar FormData
      const formData = new FormData();
      formData.append("file", file);

      // Enviar para o endpoint de upload
      const response = await fetch("/api/upload-file", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Falha no upload do arquivo");
      }

      const data = await response.json();
      
      // Adicionar URL do arquivo ao formulário
      form.setValue("resourceUrl", data.url);

      toast({
        title: "Upload concluído",
        description: "O arquivo foi enviado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Não foi possível enviar o arquivo.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Submit do formulário
  const onSubmit = (data: BibleStudyFormData) => {
    studyMutation.mutate(data);
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
              placeholder="Digite o título do estudo"
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
              placeholder="Ex: antigo testamento, novo testamento, devocionais"
            />
            {form.formState.errors.category && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.category.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="contentType">Tipo de Conteúdo</Label>
            <Select
              onValueChange={(value) => form.setValue("contentType", value)}
              defaultValue={form.getValues("contentType")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo de conteúdo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="video">Vídeo</SelectItem>
                <SelectItem value="audio">Áudio</SelectItem>
                <SelectItem value="text">Texto</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.contentType && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.contentType.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Label>Recurso</Label>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  size="sm"
                  variant={uploadType === "image" ? "default" : "outline"}
                  onClick={() => setUploadType("image")}
                >
                  Arquivo
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={uploadType === "link" ? "default" : "outline"} 
                  onClick={() => setUploadType("link")}
                >
                  Link
                </Button>
              </div>
            </div>

            {uploadType === "image" ? (
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="file"
                    id="file"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("file")?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <FileUp className="w-4 h-4 mr-2" />
                        Selecionar arquivo
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 opacity-70" />
                  <Input
                    id="resourceUrl"
                    {...form.register("resourceUrl")}
                    placeholder="https://example.com/video"
                  />
                </div>
              </div>
            )}

            {form.formState.errors.resourceUrl && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.resourceUrl.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              rows={4}
              placeholder="Descreva o conteúdo do estudo..."
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="image" className="block mb-2">
              Imagem de miniatura (opcional)
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
                      <FileUp className="w-4 h-4 mr-2" />
                      {study?.thumbnailUrl ? "Alterar imagem" : "Escolher imagem"}
                    </>
                  )}
                </Button>
              </div>
              
              {fileName && (
                <span className="text-sm text-muted-foreground">
                  {fileName}
                </span>
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
            <Label htmlFor="isPublished">Publicar estudo</Label>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={studyMutation.isPending}
            className="w-full md:w-auto"
          >
            {studyMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : study?.id ? (
              "Atualizar Estudo"
            ) : (
              "Criar Estudo"
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}