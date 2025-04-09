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
import { Loader2, FileUp } from "lucide-react";
import { motion } from "framer-motion";

// Schema para validação do formulário
const resourceSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().nullable().optional(),
  category: z.string().min(1, "Categoria é obrigatória"),
  isPublic: z.boolean().default(true),
  fileUrl: z.string().min(1, "Arquivo é obrigatório"),
  fileType: z.string().min(1, "Tipo de arquivo é obrigatório"),
});

// Tipo para os dados do formulário
type ResourceFormData = z.infer<typeof resourceSchema>;

// Props do componente
interface ResourceFormProps {
  resource?: ResourceFormData & { id?: number };
  onSuccess?: () => void;
}

export function ResourceForm({ resource, onSuccess }: ResourceFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [fileName, setFileName] = useState<string>(resource?.fileUrl ? "Arquivo atual" : "");
  const [isUploading, setIsUploading] = useState(false);

  // Configuração do formulário
  const form = useForm<ResourceFormData>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: resource?.title || "",
      description: resource?.description || "",
      category: resource?.category || "documentos",
      isPublic: resource?.isPublic !== undefined ? resource?.isPublic : true,
      fileUrl: resource?.fileUrl || "",
      fileType: resource?.fileType || "",
    },
  });

  // Mutação para criar/editar recurso
  const resourceMutation = useMutation({
    mutationFn: async (data: ResourceFormData) => {
      if (resource?.id) {
        // Edição
        return apiRequest(`/api/resources/${resource.id}`, {
          method: "PUT",
          data: data,
        });
      } else {
        // Criação
        return apiRequest("/api/resources", {
          method: "POST",
          data: data,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
      toast({
        title: resource?.id ? "Recurso atualizado" : "Recurso criado",
        description: resource?.id
          ? "O recurso foi atualizado com sucesso."
          : "O recurso foi criado com sucesso.",
      });
      form.reset();
      setFileName("");
      if (onSuccess) onSuccess();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o recurso.",
        variant: "destructive",
      });
    },
  });

  // Função para upload de arquivo
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFileName(file.name);

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
      form.setValue("fileUrl", data.url);
      form.setValue("fileType", file.type);

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
  const onSubmit = (data: ResourceFormData) => {
    resourceMutation.mutate(data);
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
              placeholder="Digite o título do recurso"
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
              placeholder="Ex: documentos, áudios, vídeos"
            />
            {form.formState.errors.category && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.category.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              rows={4}
              placeholder="Descreva o recurso..."
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="file" className="block mb-2">
              Arquivo
            </Label>
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
                      {resource?.fileUrl ? "Alterar arquivo" : "Escolher arquivo"}
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
            {form.formState.errors.fileUrl && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.fileUrl.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPublic"
              checked={form.watch("isPublic")}
              onCheckedChange={(checked) =>
                form.setValue("isPublic", checked)
              }
            />
            <Label htmlFor="isPublic">Tornar público</Label>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={resourceMutation.isPending}
            className="w-full md:w-auto"
          >
            {resourceMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : resource?.id ? (
              "Atualizar Recurso"
            ) : (
              "Criar Recurso"
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}