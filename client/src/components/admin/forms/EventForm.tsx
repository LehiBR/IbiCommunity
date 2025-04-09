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
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

// Schema para validação do formulário
const eventSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  category: z.string().min(1, "Categoria é obrigatória"),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  endDate: z.string().min(1, "Data de término é obrigatória"),
}).refine(data => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end >= start;
}, {
  message: "A data de término deve ser igual ou posterior à data de início",
  path: ["endDate"]
});

// Tipo para os dados do formulário
type EventFormData = z.infer<typeof eventSchema>;

// Props do componente
interface EventFormProps {
  event?: Omit<EventFormData, "startDate" | "endDate"> & { 
    id?: number;
    startDate?: Date;
    endDate?: Date;
  };
  onSuccess?: () => void;
}

export function EventForm({ event, onSuccess }: EventFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Formatar datas para input date-time
  const formatDateForInput = (date?: Date): string => {
    if (!date) return "";
    const d = new Date(date);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  // Configuração do formulário
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      location: event?.location || "",
      category: event?.category || "culto",
      startDate: event?.startDate ? formatDateForInput(event.startDate) : "",
      endDate: event?.endDate ? formatDateForInput(event.endDate) : "",
    },
  });

  // Mutação para criar/editar evento
  const eventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      if (event?.id) {
        // Edição
        return apiRequest(`/api/events/${event.id}`, {
          method: "PUT",
          data: data,
        });
      } else {
        // Criação
        return apiRequest("/api/events", {
          method: "POST",
          data: data,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: event?.id ? "Evento atualizado" : "Evento criado",
        description: event?.id
          ? "O evento foi atualizado com sucesso."
          : "O evento foi criado com sucesso.",
      });
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o evento.",
        variant: "destructive",
      });
    },
  });

  // Submit do formulário
  const onSubmit = (data: EventFormData) => {
    eventMutation.mutate(data);
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
              placeholder="Digite o título do evento"
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
              placeholder="Ex: culto, conferência, encontro"
            />
            {form.formState.errors.category && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.category.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Data e hora de início</Label>
              <Input
                id="startDate"
                type="datetime-local"
                {...form.register("startDate")}
              />
              {form.formState.errors.startDate && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.startDate.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="endDate">Data e hora de término</Label>
              <Input
                id="endDate"
                type="datetime-local"
                {...form.register("endDate")}
              />
              {form.formState.errors.endDate && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="location">Local (opcional)</Label>
            <Input
              id="location"
              {...form.register("location")}
              placeholder="Local do evento"
            />
            {form.formState.errors.location && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.location.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              rows={4}
              placeholder="Descreva o evento..."
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={eventMutation.isPending}
            className="w-full md:w-auto"
          >
            {eventMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : event?.id ? (
              "Atualizar Evento"
            ) : (
              "Criar Evento"
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}