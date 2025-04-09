# Lista de Arquivos Importantes para Atualizar no GitHub

Abaixo estão listados todos os arquivos importantes que devem ser atualizados no seu repositório GitHub. Certifique-se de transferir todas estas alterações quando estiver atualizando o repositório.

## Arquivos de Configuração

1. **Procfile**
   - Arquivo para configuração do Render.com
   - Contém: `web: npm start`

2. **.env.example**
   - Exemplo das variáveis de ambiente necessárias
   - Inclui configurações para SMTP, DATABASE_URL, SECRET, etc.

3. **DEPLOYMENT_GUIDE.md**
   - Guia detalhado para deploy no Render.com
   - Passo a passo com instruções específicas

4. **server/index.ts**
   - Configuração do servidor para usar a porta do ambiente
   - Necessário para o deploy em plataformas como Render.com

## Assets e Imagens

1. **client/src/assets/logo.jpg**
   - Logo oficial da igreja
   - Usado no cabeçalho, rodapé e outras seções

2. **client/favicon.ico**
   - Favicon com o logo da igreja
   - Aparece na aba do navegador

3. **uploads/**
   - Pasta para armazenar arquivos enviados pelos usuários
   - Importante para a funcionalidade de upload

## Componentes Principais

1. **client/index.html**
   - Atualizado para incluir o favicon
   - Configuração meta tags para SEO e compartilhamento

2. **client/src/components/layout/Header.tsx**
   - Cabeçalho com o logo da igreja
   - Menu de navegação atualizado

3. **client/src/components/layout/Footer.tsx**
   - Rodapé com logo e informações da igreja
   - Links de redes sociais atualizados

4. **client/src/components/home/BibleQuote.tsx**
   - Componente para exibir citações bíblicas
   - Corrigido para usar ícones Lucide

5. **client/src/components/admin/AdminDashboard.tsx**
   - Painel administrativo completo
   - Gerenciamento de usuários, conteúdo e uploads

6. **client/src/components/admin/BibleStudyManagement.tsx**
   - Interface para gerenciar estudos bíblicos
   - Formulários para criar, editar e excluir estudos

7. **client/src/pages/BibleStudy.tsx**
   - Página dedicada para exibir estudos bíblicos
   - Layout responsivo e acessível

## Arquivos de Backend

1. **server/auth.ts**
   - Sistema de autenticação com funções de login e registro
   - Recuperação de senha via email

2. **server/routes.ts**
   - Rotas da API para todas as funcionalidades
   - Endpoints para conteúdo, usuários e uploads

3. **server/storage.ts**
   - Interface de armazenamento para todos os tipos de dados
   - Implementação para PostgreSQL e memória

4. **server/uploads.ts**
   - Sistema de upload de arquivos
   - Configuração do Multer com verificação de tipo de arquivo

## Estrutura de Diretórios

Certifique-se de que a estrutura de diretórios esteja correta:

```
.
├── client/
│   ├── src/
│   │   ├── assets/
│   │   │   └── logo.jpg
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   └── BibleStudyManagement.tsx
│   │   │   ├── home/
│   │   │   │   └── BibleQuote.tsx
│   │   │   └── layout/
│   │   │       ├── Header.tsx
│   │   │       └── Footer.tsx
│   │   └── pages/
│   │       └── BibleStudy.tsx
│   ├── favicon.ico
│   └── index.html
├── server/
│   ├── auth.ts
│   ├── index.ts
│   ├── routes.ts
│   ├── storage.ts
│   └── uploads.ts
├── uploads/
├── .env.example
├── .gitignore
├── DEPLOYMENT_GUIDE.md
├── Procfile
└── README.md
```

Lembre-se de verificar cada arquivo para garantir que todas as alterações foram transferidas para o seu repositório GitHub.