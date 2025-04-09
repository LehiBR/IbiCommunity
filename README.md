# IBI Parnaíba - Sistema de Gestão da Igreja

Este projeto é um sistema de gestão para a Igreja Batista Independente de Parnaíba, desenvolvido para facilitar a administração de conteúdo, eventos, estudos bíblicos e comunicação com os membros.

## Tecnologias Utilizadas

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Node.js, Express.js
- **Banco de Dados**: PostgreSQL
- **Autenticação**: Passport.js
- **Emails**: Nodemailer (SMTP)

## Funcionalidades

- Sistema de autenticação e gerenciamento de usuários
- Painel administrativo para gestão de conteúdo
- Gerenciamento de posts e notícias
- Agenda de eventos da igreja
- Catálogo de recursos e downloads
- Sistema de estudos bíblicos
- Envio de e-mails para recuperação de senha

## Requisitos

- Node.js v18+
- PostgreSQL

## Variáveis de Ambiente

```
DATABASE_URL=postgres://user:password@host:port/database
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=seu-email@example.com
SMTP_PASS=sua-senha-smtp
SMTP_FROM=seu-email@example.com
SMTP_SECURE=true
APP_URL=https://seu-site.com
```

## Instalação e Execução

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure as variáveis de ambiente
4. Execute as migrações: `npm run db:push`
5. Inicie o servidor: `npm run dev`

## Deployment

Este projeto está configurado para deploy no Render.com.