import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { InsertMessage } from '@shared/schema';

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(3, 'Nome completo é obrigatório'),
  email: z.string().email('Email inválido'),
  subject: z.string().min(3, 'Assunto é obrigatório'),
  content: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
  newsletter: z.boolean().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const ContactForm = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  
  // Form hook
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      content: '',
      newsletter: false,
    },
  });
  
  // Contact form submission mutation
  const contactMutation = useMutation({
    mutationFn: async (data: Omit<ContactFormValues, 'newsletter'>) => {
      const res = await apiRequest('POST', '/api/contact', data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Mensagem enviada',
        description: 'Sua mensagem foi enviada com sucesso. Responderemos em breve!',
      });
      form.reset();
      setSubmitted(true);
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao enviar mensagem',
        description: error.message || 'Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.',
        variant: 'destructive',
      });
    },
  });
  
  // Handle form submission
  const onSubmit = (values: ContactFormValues) => {
    const { newsletter, ...messageData } = values;
    contactMutation.mutate(messageData);
  };
  
  // If form was submitted successfully, show success message
  if (submitted) {
    return (
      <div className="bg-status-success/10 rounded-lg p-6 text-center">
        <span className="material-icons text-status-success text-4xl mb-3">check_circle</span>
        <h3 className="text-lg font-semibold mb-2">Mensagem Enviada!</h3>
        <p className="text-gray-600 mb-4">
          Agradecemos seu contato. Nossa equipe responderá o mais breve possível.
        </p>
        <Button
          onClick={() => setSubmitted(false)}
          variant="outline"
        >
          Enviar outra mensagem
        </Button>
      </div>
    );
  }
  
  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome</Label>
          <Input
            id="name"
            type="text"
            placeholder="Seu nome completo"
            {...form.register('name')}
            className="w-full px-4 py-2 border border-neutral-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="email_contact" className="block text-sm font-medium text-gray-700 mb-1">E-mail</Label>
          <Input
            id="email_contact"
            type="email"
            placeholder="seu@email.com"
            {...form.register('email')}
            className="w-full px-4 py-2 border border-neutral-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.email.message}</p>
          )}
        </div>
      </div>
      
      <div>
        <Label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Assunto</Label>
        <Input
          id="subject"
          type="text"
          placeholder="Assunto da sua mensagem"
          {...form.register('subject')}
          className="w-full px-4 py-2 border border-neutral-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {form.formState.errors.subject && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.subject.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Mensagem</Label>
        <Textarea
          id="content"
          rows={5}
          placeholder="Escreva sua mensagem aqui..."
          {...form.register('content')}
          className="w-full px-4 py-2 border border-neutral-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
        {form.formState.errors.content && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.content.message}</p>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="newsletter"
          {...form.register('newsletter')}
        />
        <Label htmlFor="newsletter" className="text-sm text-gray-700 cursor-pointer">
          Quero receber novidades e atualizações por e-mail
        </Label>
      </div>
      
      <Button
        type="submit"
        className="bg-primary text-white py-2 px-6 rounded-md hover:bg-darkblue transition inline-flex items-center"
        disabled={contactMutation.isPending}
      >
        {contactMutation.isPending ? (
          <>
            <span className="material-icons animate-spin mr-2">autorenew</span>
            Enviando...
          </>
        ) : (
          <>
            Enviar Mensagem
            <span className="material-icons ml-2">send</span>
          </>
        )}
      </Button>
    </form>
  );
};

export default ContactForm;
