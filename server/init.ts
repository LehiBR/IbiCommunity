import { db } from './db';
import { users } from '@shared/schema';
import { sql } from 'drizzle-orm';
import bcrypt from 'bcrypt';

/**
 * Esta função verifica se já existe um usuário administrador no sistema
 * e cria um caso não exista
 */
export async function initializeAdmin() {
  try {
    // Verificar se existem usuários com papel de admin
    const admins = await db.select().from(users).where(sql`${users.role} = 'admin'`);
    
    if (admins.length === 0) {
      console.log('Nenhum administrador encontrado. Criando usuário admin padrão...');
      
      // Criar um hash para a senha "admin123"
      const passwordHash = await bcrypt.hash('admin123', 10);
      
      // Inserir o administrador padrão
      await db.insert(users).values({
        username: 'admin',
        email: 'admin@ibiparnaiba.org', // Altere para um email real antes do deploy
        password: passwordHash,
        name: 'Administrador',
        role: 'admin',
        createdAt: new Date()
      });
      
      console.log('Usuário administrador criado com sucesso! Username: admin, Senha: admin123');
      console.log('IMPORTANTE: Altere esta senha imediatamente após o primeiro login.');
    } else {
      console.log(`${admins.length} administrador(es) já existe(m) no sistema.`);
    }
  } catch (error) {
    console.error('Erro ao inicializar o administrador:', error);
  }
}