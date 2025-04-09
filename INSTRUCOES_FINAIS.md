# Instruções Finais para Configuração do Projeto

## Atualização do GitHub

Siga as instruções detalhadas no arquivo `GITHUB_INSTRUCTIONS.md` para atualizar seu repositório no GitHub com todas as mudanças feitas.

## Nova Imagem do Logo

Você compartilhou uma nova imagem de logo (IMG-20250409-WA0005.jpg) que precisa ser adicionada ao projeto:

1. Copie a imagem `attached_assets/IMG-20250409-WA0005.jpg` para a pasta `client/src/assets/logo.jpg` do seu projeto local.
2. Se desejar usar esta nova imagem como ícone do site, converta-a para o formato `.ico` usando uma ferramenta online como [favicon.io](https://favicon.io/) e substitua o arquivo `client/favicon.ico`.

## Deploy no Render.com

Após atualizar o GitHub, siga as instruções detalhadas no arquivo `DEPLOYMENT_GUIDE.md` para fazer o deploy do seu site no Render.com.

## Configuração das Variáveis de Ambiente

Quando estiver configurando o serviço no Render.com, certifique-se de adicionar todas as variáveis de ambiente listadas no arquivo `.env.example`:

```
# Configurações do Banco de Dados
DATABASE_URL=postgres://user:password@host:port/database

# Configurações SMTP para envio de e-mails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-ou-app-password
SMTP_FROM=seu-email@gmail.com
SMTP_SECURE=true

# URL pública do site (usada para links em e-mails)
APP_URL=https://seu-site.com

# Porta do servidor (gerenciada automaticamente pelo Render.com)
PORT=5000
```

## Notas Importantes sobre o SMTP do Gmail

Para usar o Gmail como servidor SMTP para envio de e-mails, você precisará:

1. Ter uma conta Google/Gmail
2. Ativar a verificação em duas etapas na sua conta Google
3. Gerar uma "Senha de App" específica para o site:
   - Acesse [Senhas de App](https://myaccount.google.com/apppasswords)
   - Selecione "Outro" como tipo de app e dê um nome como "IBI Parnaíba Website"
   - Use a senha gerada como valor para `SMTP_PASS` nas variáveis de ambiente

## Verificação Final

Após concluir o deploy, verifique as seguintes funcionalidades:

1. Login e registro de usuários
2. Recuperação de senha via email
3. Painel administrativo
4. Upload de arquivos e imagens
5. Gerenciamento de estudos bíblicos

Se encontrar algum problema, consulte a seção "Solução de Problemas" no guia de deploy.