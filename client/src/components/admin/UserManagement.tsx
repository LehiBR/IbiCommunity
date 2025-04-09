import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Check, X, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

interface EditUserFormData {
  name?: string;
  role?: string;
}

export function UserManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editData, setEditData] = useState<EditUserFormData>({});
  
  // Fetch all users
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    onError: () => {
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários.",
        variant: "destructive"
      });
    }
  });
  
  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest(`/api/admin/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso."
      });
      setEditingUser(null);
      setEditData({});
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar usuário",
        description: "Não foi possível atualizar as informações do usuário.",
        variant: "destructive"
      });
    }
  });
  
  const startEditing = (user: User) => {
    setEditingUser(user);
    setEditData({
      name: user.name,
      role: user.role
    });
  };
  
  const cancelEditing = () => {
    setEditingUser(null);
    setEditData({});
  };
  
  const saveUserChanges = () => {
    if (!editingUser) return;
    
    // Filter out empty values
    const dataToUpdate = Object.entries(editData)
      .filter(([_, value]) => value !== undefined && value !== '')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    
    updateUserMutation.mutate({ id: editingUser.id, data: dataToUpdate });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Usuários</CardTitle>
        <CardDescription>
          Gerencie todos os usuários do sistema e defina suas permissões.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Data de criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {editingUser?.id === user.id ? (
                    <Input 
                      value={editData.name || ''} 
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full"
                    />
                  ) : (
                    user.name
                  )}
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {editingUser?.id === user.id ? (
                    <Select 
                      value={editData.role || user.role} 
                      onValueChange={(value) => setEditData({ ...editData, role: value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione uma função" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Membro</SelectItem>
                        <SelectItem value="moderator">Moderador</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2">
                      {user.role === 'admin' && <Shield className="h-4 w-4 text-primary" />}
                      {user.role === 'admin' ? 'Administrador' : user.role === 'moderator' ? 'Moderador' : 'Membro'}
                    </div>
                  )}
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell className="text-right">
                  {editingUser?.id === user.id ? (
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={saveUserChanges}
                        disabled={updateUserMutation.isPending}
                      >
                        {updateUserMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={cancelEditing}
                        disabled={updateUserMutation.isPending}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => startEditing(user)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}