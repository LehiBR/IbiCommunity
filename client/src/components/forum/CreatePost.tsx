import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

// Schema for creating a forum post
const forumPostSchema = z.object({
  title: z.string().min(5, {
    message: "O título deve ter pelo menos 5 caracteres.",
  }),
  content: z.string().min(10, {
    message: "O conteúdo deve ter pelo menos 10 caracteres.",
  }),
  category: z.string().min(1, {
    message: "Selecione uma categoria.",
  }),
});

type ForumPostValues = z.infer<typeof forumPostSchema>;

interface CreatePostProps {
  onClose: () => void;
  categories: { value: string; label: string }[];
}

const CreatePost = ({ onClose, categories }: CreatePostProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(true);

  // Form definition
  const form = useForm<ForumPostValues>({
    resolver: zodResolver(forumPostSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
    },
  });

  // Create post mutation
  const createMutation = useMutation({
    mutationFn: async (values: ForumPostValues) => {
      const res = await apiRequest("POST", "/api/forum", values);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Tópico criado",
        description: "Seu tópico foi publicado com sucesso no fórum.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/forum"] });
      handleClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar tópico",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (values: ForumPostValues) => {
    createMutation.mutate(values);
  };

  // Handle closing the dialog
  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Tópico</DialogTitle>
          <DialogDescription>
            Compartilhe suas ideias, dúvidas ou testemunhos com a comunidade.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título do seu tópico" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Escreva o conteúdo do seu tópico aqui..." 
                      className="min-h-[200px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <span className="material-icons animate-spin mr-2">autorenew</span>
                ) : (
                  <span className="material-icons mr-2">add</span>
                )}
                Publicar Tópico
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
