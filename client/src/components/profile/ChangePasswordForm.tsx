import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Esquema de validação para a troca de senha
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "A senha atual é obrigatória"),
  newPassword: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres"),
  confirmNewPassword: z.string().min(1, "A confirmação da nova senha é obrigatória"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "As senhas não coincidem",
  path: ["confirmNewPassword"],
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm() {
  const { toast } = useToast();
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);

  // Define o formulário
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  // Cria a mutation para a troca de senha
  const changePasswordMutation = useMutation({
    mutationFn: async (data: ChangePasswordFormValues) => {
      const response = await apiRequest("POST", "/api/change-password", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Senha alterada com sucesso",
        description: "Sua senha foi atualizada",
        variant: "default",
      });
      form.reset();
      setIsPasswordChanged(true);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao alterar a senha",
        description: error.message || "Ocorreu um erro ao tentar alterar sua senha",
        variant: "destructive",
      });
    },
  });

  // Função que é chamada quando o formulário é enviado
  function onSubmit(data: ChangePasswordFormValues) {
    changePasswordMutation.mutate(data);
  }

  return (
    <div className="space-y-6">
      {isPasswordChanged ? (
        <div className="bg-green-50 p-4 rounded-md text-green-800 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="material-icons text-green-500">check_circle</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">Senha alterada com sucesso!</h3>
              <div className="mt-2 text-sm">
                <p>Sua senha foi atualizada com sucesso. Use a nova senha para seus próximos logins.</p>
              </div>
              <div className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPasswordChanged(false)}
                >
                  Alterar novamente
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha Atual</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Digite sua senha atual" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Digite sua nova senha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Nova Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirme sua nova senha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending ? (
                <>
                  <span className="material-icons animate-spin mr-2">autorenew</span>
                  Alterando...
                </>
              ) : (
                "Alterar Senha"
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}