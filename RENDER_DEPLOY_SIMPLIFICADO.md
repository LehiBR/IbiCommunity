# Guia de Deploy Simplificado no Render.com

Este é um guia adaptado para fazer o deploy do sistema IBI Parnaíba no Render.com usando apenas recursos gratuitos.

## Passo 1: Preparação do Código

Antes de fazer o deploy, certifique-se de que:

1. O código está atualizado no GitHub
2. O arquivo `Procfile` está presente no repositório
3. O arquivo `server/init.ts` foi criado para inicialização automática do admin
4. O arquivo `server/index.ts` foi atualizado para chamar `initializeAdmin()`

## Passo 2: Criar o Banco de Dados PostgreSQL

1. No Dashboard do Render, clique no botão "New +"
2. Selecione "PostgreSQL"
3. Preencha os campos:
   - **Name**: `ibi-parnaiba-db`
   - **Database**: `ibicommunity`
   - **User**: deixe o padrão sugerido pelo Render
   - **Region**: "Ohio (US East)" (mais próximo do Brasil)
   - **PostgreSQL Version**: Deixe no padrão
   - **Instance Type**: Selecione "Free"
4. Clique em "Create Database"
5. **IMPORTANTE**: Anote o **Internal Database URL** que aparecerá

## Passo 3: Criar o Web Service

1. No Dashboard do Render, clique em "New +" e selecione "Web Service"
2. Conecte ao seu repositório GitHub onde está o código
3. Configure o serviço:
   - **Name**: `ibi-parnaiba`
   - **Region**: mesma região do banco de dados (Ohio)
   - **Branch**: `main`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run db:push && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

4. Clique em "Advanced" e adicione as seguintes variáveis de ambiente:
   - `DATABASE_URL`: Cole o valor do "Internal Database URL" do banco criado
   - `SMTP_HOST`: smtp.gmail.com
   - `SMTP_PORT`: 587
   - `SMTP_USER`: seu endereço Gmail
   - `SMTP_PASS`: senha de app do Gmail
   - `SMTP_FROM`: seu endereço Gmail
   - `SMTP_SECURE`: true
   - `NODE_VERSION`: 18.0.0

5. Clique em "Create Web Service"

## Passo 4: Configuração Final

1. Depois que o deploy inicial estiver completo, você verá a URL do seu app
2. Volte às configurações do seu Web Service:
   - Clique em "Environment" no menu lateral do seu serviço
   - Adicione a variável `APP_URL` com o valor da URL completa do seu app (incluindo https://)
   - Clique em "Save Changes"

3. Force um novo deploy:
   - Vá para a aba "Manual Deploy"
   - Clique em "Deploy latest commit"

## Passo 5: Evitar a Hibernação (Opcional)

O plano gratuito do Render hiberna após 15 minutos de inatividade. Para manter seu site ativo 24/7:

1. Registre-se em [UptimeRobot](https://uptimerobot.com/) (serviço gratuito)
2. Crie um monitor HTTP que acesse seu site a cada 14 minutos
3. Configure o URL do seu site no UptimeRobot

## Passo 6: Teste Final e Verificação

1. Acesse seu site pela URL fornecida pelo Render
2. Tente fazer login com o usuário admin que é criado automaticamente:
   - Username: `admin`
   - Senha: `admin123`
3. Altere a senha do administrador imediatamente após o primeiro login

## Notas Sobre Armazenamento de Arquivos

**Importante**: Como não podemos usar o recurso Disks do Render no plano gratuito, o upload de arquivos tem as seguintes limitações:

1. Os arquivos enviados serão armazenados temporariamente e serão perdidos quando o servidor reiniciar ou quando houver um novo deploy
2. Para uma solução permanente, consulte o arquivo `STORAGE_ALTERNATIVES.md` com opções de serviços de armazenamento

## Limitações do Plano Gratuito

- O plano gratuito do Render para o banco de dados PostgreSQL expira após 90 dias
- O serviço web gratuito pode hibernar após 15 minutos de inatividade (use o UptimeRobot para evitar isso)
- Não há armazenamento persistente para arquivos no plano gratuito
- Os recursos de computação são limitados

## Solução de Problemas

- **Erro na migração do banco**: Verifique os logs de build do Render
- **Usuário admin não criado**: Verifique os logs de aplicação no Render
- **Problemas de envio de e-mail**: Confirme se configurou uma senha de app válida para o Gmail
- **Site lento**: Normal no plano gratuito, especialmente após hibernação