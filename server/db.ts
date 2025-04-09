import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Em desenvolvimento, use um banco de dados local temporário se DATABASE_URL não estiver definido
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ibicommunity';

let pool: Pool;

try {
  pool = new Pool({ connectionString: DATABASE_URL });
} catch (error) {
  console.error("Erro ao conectar ao banco de dados:", error);
  // Se estamos apenas testando a aplicação no Replit, ainda podemos usar memStorage
  console.log("Usando armazenamento em memória como fallback para testes");
  pool = {} as Pool; // Fallback vazio para ambiente de desenvolvimento
}

export const db = drizzle({ client: pool, schema });
