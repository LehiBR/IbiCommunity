# Guia de Deploy no Render.com

Este guia fornece instruções detalhadas para implantar o sistema de gestão da Igreja Batista Independente de Parnaíba no Render.com.

## Pré-requisitos

1. Uma conta no [Render.com](https://render.com/) (você pode se registrar gratuitamente)
2. O código do projeto em um repositório Git (GitHub, GitLab, etc.)

## Passo 1: Criar o Banco de Dados PostgreSQL

1. Faça login na sua conta do Render.com
2. No dashboard, clique em "New" e selecione "PostgreSQL"
3. Configure seu banco de dados:
   - **Nome**: `ibi-parnaiba-db` (ou outro nome de sua escolha)
   - **Região**: Escolha a região mais próxima do Brasil (provavelmente Ohio ou Virginia)
   - **Plano**: Free
4. Clique em "Create Database"
5. Após a criação, anote as seguintes informações que serão exibidas:
   - **Internal Database URL** (para usar no Web Service)
   - **PSQL Command** (contém informações de usuário, senha e host)

## Passo 2: Criar o Web Service

1. No dashboard do Render, clique em "New" e selecione "Web Service"
2. Conecte ao seu repositório Git (GitHub, GitLab, etc.)
3. Configure o serviço:
   - **Nome**: `ibi-parnaiba` (ou outro nome de sua preferência)
   - **Região**: Escolha a mesma região do banco de dados
   - **Branch**: `main` (ou a branch principal do seu repositório)
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plano**: Free

4. Adicione as variáveis de ambiente clicando em "Environment":
   - `DATABASE_URL`: Cole o valor do "Internal Database URL" do passo anterior
   - `SMTP_HOST`: Servidor SMTP (ex: smtp.gmail.com)
   - `SMTP_PORT`: Porta do servidor SMTP (ex: 587 ou 465)
   - `SMTP_USER`: Seu endereço de e-mail
   - `SMTP_PASS`: Sua senha de aplicativo do e-mail
   - `SMTP_FROM`: Endereço de e-mail remetente
   - `SMTP_SECURE`: `true` ou `false` (depende se usa TLS)
   - `APP_URL`: Inicialmente deixe em branco, preencherá após o deploy

5. Clique em "Create Web Service"

## Passo 3: Configurar Armazenamento Persistente para Uploads

O plano gratuito do Render não mantém arquivos enviados permanentemente. Para resolver isso:

1. No dashboard do Render, vá para "Disks"
2. Clique em "New Disk"
3. Configure:
   - **Nome**: `ibi-uploads`
   - **Tamanho**: 1GB (gratuito)
   - **Mountpath**: `/opt/render/project/src/uploads`
4. Associe ao seu Web Service

Alternativa: Use um serviço de armazenamento em nuvem como Cloudinary (que tem plano gratuito) para armazenar imagens e arquivos.

## Passo 4: Finalizar a Configuração

Depois que o deploy inicial estiver completo:

1. Obtenha a URL do seu aplicativo (algo como `ibi-parnaiba.onrender.com`)
2. Volte às configurações do Web Service e adicione a variável de ambiente:
   - `APP_URL`: a URL completa do seu aplicativo, incluindo `https://`

3. Force uma nova implantação clicando em "Manual Deploy" > "Clear build cache & deploy"

## Passo 5: Executar a Migração do Banco de Dados

Para configurar o banco de dados:

1. No dashboard do Render, vá até seu Web Service
2. Clique em "Shell" para acessar o terminal
3. Execute o comando de migração: `npm run db:push`
4. Crie um usuário administrador inicial:
   ```bash
   # Acesse o PostgreSQL
   psql $DATABASE_URL
   
   # Crie o usuário admin (substitua os valores conforme necessário)
   INSERT INTO users (username, email, password, name, role, created_at) 
   VALUES ('admin', 'admin@example.com', '$2b$10$RgmjDNGLEIhHfHaQQjf.4eRuZw3hBCAQgZLrDJLLNL8GoXL7XgyHy', 'Administrador', 'admin', NOW());
   
   # Senha padrão: admin123 (altere imediatamente após o primeiro login)
   ```

## Passo 6: Evitar a Hibernação (Opcional)

Para evitar que o serviço gratuito hiberne após 15 minutos de inatividade:

1. Registre-se em um serviço de monitoramento gratuito como [UptimeRobot](https://uptimerobot.com/)
2. Configure um monitor HTTP(S) que faça pings no seu site a cada 14 minutos
3. Este procedimento manterá seu site ativo 24/7

## Passo 7: Configurar Domínio Personalizado (Opcional)

1. No dashboard do Render, acesse seu Web Service
2. Clique em "Settings" > "Custom Domain"
3. Siga as instruções para adicionar e verificar seu domínio personalizado
4. Lembre-se de atualizar a variável `APP_URL` com o novo domínio

## Solução de Problemas

- **Erro de conexão com o banco de dados**: Verifique se a URL do banco de dados está correta nas variáveis de ambiente
- **Problemas de envio de e-mail**: Confirme se as credenciais SMTP estão corretas
- **Erros 500**: Verifique os logs do serviço no dashboard do Render
- **Problemas de upload**: Verifique se o disco persistente está configurado corretamente

## Notas Importantes

- O plano gratuito do Render para o banco de dados PostgreSQL expira após 90 dias
- O serviço web gratuito pode hibernar após 15 minutos de inatividade
- O plano gratuito possui limitações de CPU e RAM - monitore o uso
- Faça backups regulares do banco de dados

## Mais Informações

Para mais detalhes sobre a plataforma Render, consulte a [documentação oficial](https://render.com/docs).