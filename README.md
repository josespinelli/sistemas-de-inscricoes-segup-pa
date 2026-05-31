# Sistema de Inscrições — SEGUP/PA

Sistema web para gerenciamento de inscrições de serviços da Secretaria de Estado de Segurança Pública e Defesa Social do Pará. Permite criar, consultar, editar e cancelar inscrições, com geração automática de protocolo.

![Java](https://img.shields.io/badge/Java-17-blue) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen) ![React](https://img.shields.io/badge/React-18-61dafb) ![MySQL](https://img.shields.io/badge/MySQL-8.0-orange) ![Docker](https://img.shields.io/badge/Docker-Compose-2496ed)

---

## Tecnologias utilizadas

**Backend**
- Java 17
- Spring Boot 3.2.5
- Spring Web, Spring Data JPA, Spring Bean Validation
- MySQL 8.0 (driver `mysql-connector-j`)
- springdoc-openapi 2.5.0 (Swagger UI)
- Maven (build)

**Frontend**
- React 18
- Vite (bundler e dev server)
- Axios (HTTP client)
- React Router DOM v6

**Infraestrutura**
- Docker + Docker Compose

---

## Pré-requisitos

**Para rodar com Docker (recomendado):**
- Docker Desktop instalado e em execução

**Para rodar localmente sem Docker:**
- Java 17
- Maven 3.8+
- Node 18+
- MySQL 8.0 rodando localmente

---

## Como rodar com Docker (recomendado)

O Docker Compose sobe os três serviços necessários: banco de dados, backend e frontend.

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>

# 2. Entre na pasta do backend
cd incricoes-segup

# 3. Copie o arquivo de variáveis de ambiente
cp .env.example .env

# 4. Ajuste o .env se necessário (o padrão já funciona com Docker)
# DB_HOST deve ser "mysql" ao rodar com Docker

# 5. Suba os containers
docker compose up --build

# 6. Aguarde o MySQL inicializar (~30 segundos)
# O backend depende do healthcheck do MySQL, então só sobe quando o banco estiver pronto

# 7. Acesse o frontend
# http://localhost:5173
```

> **Atenção:** ao rodar com Docker, `DB_HOST` no `.env` deve ser `mysql` (nome do serviço no Compose). Ao rodar localmente sem Docker, use `localhost`.

Para parar os containers:
```bash
docker compose down
```

Para parar e apagar os dados do banco:
```bash
docker compose down -v
```

---

## Como rodar sem Docker (desenvolvimento local)

### Backend

Pré-requisitos: Java 17, Maven, MySQL rodando localmente.

```bash
# 1. Entre na pasta do backend
cd incricoes-segup

# 2. Copie e ajuste as variáveis de ambiente
cp .env.example .env
# Edite .env e defina DB_HOST=localhost

# 3. Crie o banco de dados no MySQL
mysql -u root -p -e "CREATE DATABASE segup_inscricoes;"

# 4. Suba a aplicação
mvn spring-boot:run
```

API disponível em `http://localhost:8080`.

### Frontend

Pré-requisitos: Node 18+.

```bash
# 1. Entre na pasta do frontend (diretório irmão do backend)
cd incricoes-segup-frontend

# 2. Copie e ajuste as variáveis de ambiente
cp .env.example .env
# Edite .env e defina VITE_API_URL=http://localhost:8080

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Frontend disponível em `http://localhost:5173`.

---

## Variáveis de ambiente

### Backend — `incricoes-segup/.env`

| Variável | Padrão (Docker) | Padrão (local) | Descrição |
|---|---|---|---|
| `DB_HOST` | `mysql` | `localhost` | Host do banco de dados |
| `DB_PORT` | `3306` | `3306` | Porta do MySQL |
| `DB_NAME` | `segup_inscricoes` | `segup_inscricoes` | Nome do banco |
| `DB_USER` | `root` | `root` | Usuário do banco |
| `DB_PASS` | `root` | `root` | Senha do banco |
| `SERVER_PORT` | `8080` | `8080` | Porta da API |

### Frontend — `incricoes-segup-frontend/.env`

| Variável | Valor (local) | Valor (Docker) | Descrição |
|---|---|---|---|
| `VITE_API_URL` | `http://localhost:8080` | `/api` | URL base da API (Docker usa nginx como proxy) |

---

## Endpoints principais

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/api/inscricoes` | Criar inscrição |
| `GET` | `/api/inscricoes` | Listar todas as inscrições |
| `GET` | `/api/inscricoes/{id}` | Buscar por ID |
| `GET` | `/api/inscricoes/protocolo/{protocolo}` | Buscar por protocolo |
| `PUT` | `/api/inscricoes/{id}` | Atualizar inscrição |
| `PATCH` | `/api/inscricoes/{id}/cancelar` | Cancelar inscrição |

Documentação interativa completa (Swagger UI): `http://localhost:8080/swagger-ui.html`

### Exemplo de payload (POST /api/inscricoes)

```json
{
  "nomeCompleto": "João da Silva",
  "cpf": "123.456.789-00",
  "email": "joao@exemplo.com",
  "telefone": "(91) 99999-9999",
  "servico": "Emissão de Antecedentes Criminais",
  "observacao": "Urgente"
}
```

---

## Fluxo da inscrição

1. Usuário preenche o formulário no frontend com nome, CPF, e-mail, telefone e serviço desejado.
2. Frontend valida os campos obrigatórios e envia `POST /api/inscricoes` com os dados.
3. Backend valida os dados via Bean Validation (formato de CPF, e-mail válido, campos obrigatórios).
4. O serviço gera automaticamente o protocolo no formato `INS-YYYYMMDD-XXXX`, onde `XXXX` é a sequência do dia.
5. A inscrição é persistida no banco com status `CONFIRMADA`.
6. A API retorna os dados completos, incluindo o protocolo gerado.
7. Frontend redireciona para a página de confirmação exibindo o protocolo.
8. Pela listagem, o usuário pode visualizar detalhes, editar os dados ou cancelar a inscrição.

---

## Regras de negócio

- **Campos obrigatórios:** nome completo, CPF, e-mail, telefone e serviço.
- **CPF:** deve estar no formato `000.000.000-00` (validado por regex).
- **Protocolo:** gerado automaticamente no formato `INS-YYYYMMDD-XXXX` — o sufixo é a contagem sequencial de inscrições do dia.
- **Status inicial:** toda inscrição criada começa com status `CONFIRMADA`.
- **Cancelamento:** altera o status para `CANCELADA`, sem excluir o registro do banco.
- **Restrição de edição:** inscrições `CANCELADAS` não podem ser editadas nem canceladas novamente (retorna HTTP 409).

---

## Decisões técnicas e limitações

**Stack escolhida:** Java com Spring Boot foi usado por ser a stack pedida no escopo do teste e por sua maturidade para sistemas institucionais — convenções bem estabelecidas, ecossistema maduro de validação, persistência e documentação de API.

**"API de inscrição" como camada interna:** o fluxo implementado é `frontend → controller → service → repository → banco`. Não há integração com sistemas externos; o que está descrito como "API de inscrição" é a própria camada de serviço interna, que encapsula as regras de negócio e orquestra a persistência.

**Docker Compose:** a escolha de empacotar os três serviços (banco, backend, frontend) em um único `docker compose up --build` foi deliberada para eliminar a necessidade de configuração manual de ambiente. Qualquer pessoa com Docker instalado consegue rodar o sistema do zero.

**Sem autenticação/autorização:** fora do escopo do teste. Todos os endpoints são abertos.

**Sem paginação:** a listagem retorna todos os registros. Para o volume de dados esperado neste contexto, não é necessário.

**Geração de protocolo:** a sequência diária é calculada via contagem de registros no banco. Em cenários de alto volume com requisições simultâneas, o correto seria usar uma sequence de banco de dados para evitar colisões — o próprio código documenta isso.

---

## Estrutura do projeto

```
incricoes-segup/                          ← backend
├── src/main/java/com/segup/inscricoes/
│   ├── controller/                       ← endpoints REST
│   ├── service/                          ← regras de negócio
│   ├── repository/                       ← acesso ao banco (Spring Data JPA)
│   ├── entity/                           ← entidades JPA
│   ├── dto/                              ← request e response DTOs
│   ├── exception/                        ← handler global de exceções
│   ├── util/                             ← gerador de protocolo
│   └── config/                           ← CORS, OpenAPI
├── src/main/resources/
│   ├── application.properties
│   ├── schema.sql                        ← DDL executado na inicialização
│   └── data.sql                          ← dados de seed (opcional)
├── docker-compose.yml
├── Dockerfile
├── .env.example
└── pom.xml

incricoes-segup-frontend/                 ← frontend (diretório irmão)
└── src/
    ├── pages/                            ← telas da aplicação
    ├── components/                       ← componentes reutilizáveis
    ├── services/                         ← chamadas HTTP com Axios
    └── utils/                            ← funções auxiliares
```
