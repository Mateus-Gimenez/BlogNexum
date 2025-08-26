# BlogNexum: Plataforma de Blog com ASP.NET e Next.js

Esta é uma plataforma de blog simples que permite aos usuários se registrarem, fazerem login, e criarem, visualizarem, editarem e excluírem suas próprias postagens.

## Tecnologias Utilizadas

-   **Backend**: ASP.NET Core Web API, C#, Entity Framework Core
-   **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Axios
-   **Banco de Dados**: MySQL

## Estrutura do Projeto

O projeto está dividido em duas pastas principais:

-   `backend/`: Contém a API RESTful.
-   `frontend/`: Contém a aplicação web (SPA).

---

## Como Configurar e Rodar a Aplicação

### Pré-requisitos

-   [.NET 6 SDK](https://dotnet.microsoft.com/download/dotnet/6.0) ou superior
-   [Node.js](https://nodejs.org/) (versão 16 ou superior)
-   Um servidor de banco de dados MySQL em execução.

### 1. Configuração do Backend (ASP.NET)

1.  **Navegue até a pasta do backend:**
    ```bash
    cd backend/BlogNexum.WebApi
    ```

2.  **Configure a string de conexão com o banco de dados:**
    Abra o arquivo `appsettings.Development.json` e altere a `DefaultConnection` para apontar para o seu banco de dados MySQL. 
    Exemplo:
    ```json
    "ConnectionStrings": {
      "DefaultConnection": "Server=localhost;Port=3306;Database=blognexum_db;Uid=root;Pwd=sua_senha;"
    }
    ```

3.  **Aplique as migrações do banco de dados:**
    O Entity Framework Core criará o banco de dados e as tabelas para você. Execute o comando a seguir no terminal, dentro da pasta do projeto WebApi:
    ```bash
    dotnet ef database update
    ```

4.  **Execute a API:**
    ```bash
    dotnet run
    ```
    A API estará em execução, geralmente em `https://localhost:7208` ou `http://localhost:5208`.

### 2. Configuração do Frontend (Next.js)

1.  **Navegue até a pasta do frontend:**
    ```bash
    cd frontend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure a URL da API:**
    O frontend precisa saber onde a API está rodando. O código já está configurado em `src/services/api.ts` para usar `http://localhost:5208/api`. Se sua API estiver rodando em uma porta diferente, ajuste o arquivo.

4.  **Execute a aplicação:**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:3000`.

Agora você pode abrir `http://localhost:3000` no seu navegador, se registrar e começar a usar a plataforma.
