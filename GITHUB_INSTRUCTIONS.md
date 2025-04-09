# Instruções para Atualizar o GitHub

Este arquivo contém instruções detalhadas para você atualizar seu repositório GitHub com as alterações mais recentes feitas neste projeto.

## Pré-requisitos

1. Git instalado em sua máquina local
2. Acesso (usuário e senha) à sua conta GitHub
3. Permissão de escrita no repositório `https://github.com/LehiBR/IbiCommunity`

## Passos para Atualizar o GitHub

### 1. Clone o Repositório (se ainda não tiver feito)

```bash
git clone https://github.com/LehiBR/IbiCommunity.git
cd IbiCommunity
```

### 2. Atualize o Repositório Local com os Arquivos deste Projeto

Copie todos os arquivos deste projeto para a pasta do repositório local, substituindo os arquivos existentes.

### 3. Verifique as Alterações

```bash
git status
```

Isso mostrará quais arquivos foram modificados, adicionados ou removidos.

### 4. Adicione as Alterações

```bash
git add .
```

### 5. Faça um Commit com as Alterações

```bash
git commit -m "Atualizado logo da igreja, corrigido ícones e preparado para deploy no Render.com"
```

### 6. Envie as Alterações para o GitHub

```bash
git push origin main
```

Se solicitado, insira seu nome de usuário e senha do GitHub.

## Arquivos Importantes que Foram Atualizados

Certifique-se de que os seguintes arquivos foram adicionados/modificados em seu repositório local antes de fazer o commit:

- `client/src/assets/logo.jpg` (Logo da igreja)
- `client/favicon.ico` (Favicon)
- `client/index.html` (Configuração do favicon)
- `client/src/components/layout/Header.tsx` (Logo no cabeçalho)
- `client/src/components/layout/Footer.tsx` (Logo e ícones no rodapé)
- `client/src/components/home/BibleQuote.tsx` (Logo e ícones na citação bíblica)
- `server/index.ts` (Configuração da porta)
- `Procfile` (Para deploy no Render)
- `.gitignore` (Configurações de Git)
- `README.md` (Instruções do projeto)
- `DEPLOYMENT_GUIDE.md` (Guia detalhado de deploy)
- `.env.example` (Exemplo de variáveis de ambiente)

## Problemas Comuns e Soluções

### Problema de Autenticação

Se você estiver tendo problemas de autenticação, configure um token de acesso pessoal:

1. Acesse [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Clique em "Generate new token"
3. Dê um nome ao token, selecione os escopos necessários (pelo menos "repo")
4. Gere o token e copie-o
5. Use este token como senha quando solicitado durante o comando `git push`

### Conflitos de Merge

Se houver conflitos de merge:

```bash
git pull origin main
# Resolva os conflitos manualmente
git add .
git commit -m "Resolvido conflitos de merge"
git push origin main
```

## Após a Atualização do GitHub

Depois de atualizar o GitHub, você pode seguir o guia `DEPLOYMENT_GUIDE.md` para fazer o deploy do seu site no Render.com.