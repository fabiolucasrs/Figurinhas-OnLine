# Figurinhas OnLine — CLAUDE.md

## Regras Fundamentais

- **Nunca faça commits automáticos.** Sempre aguarde confirmação do usuário antes de commitar.
- Todo texto em **português do Brasil** com acentuação correta.
- Use `make` para todos os comandos — nunca rode `php artisan` ou `npm` diretamente fora do Makefile.

## Stack Tecnológica

**Backend:** Laravel 11 · PHP 8.4 · MySQL 8 · Laravel Sanctum · REST JSON API

**Frontend:** React 19 · TypeScript 5 · Vite · Tailwind CSS · React Router v6

**Infraestrutura:** Docker · Docker Compose · Nginx · Redis

## Estrutura do Projeto

```
/
├── backend/          Laravel 11 (API)
├── pages/            Páginas React (cada rota = uma página)
├── components/       Componentes reutilizáveis
│   └── ui/           Componentes genéricos (Toast, Modal, Skeleton)
├── services/         Chamadas HTTP (axios) por domínio
├── hooks/            Custom hooks React
├── utils/            Funções utilitárias puras
├── contexts/         React Context (Auth, Toast)
├── types/            Interfaces TypeScript globais
├── docker/           Dockerfiles e configs Nginx
├── Makefile
├── docker-compose.yml
└── package.json
```

## Comandos Make

| Comando | Descrição |
|---|---|
| `make up` | Sobe ambiente de desenvolvimento |
| `make down` | Para todos os containers |
| `make install` | Instalação inicial do projeto |
| `make migrate` | Executa migrations |
| `make seed` | Executa seeders |
| `make fresh` | Recria banco com seed |
| `make shell` | Acessa container PHP |
| `make db` | Acessa MySQL |
| `make thinker` | Laravel Tinker |
| `make build` | Compila frontend para produção |
| `make send` | Lint + commit + push para main |
| `make deploy` | Pull + deploy completo |

## Padrões de Código

### React / TypeScript

- Componentes funcionais com hooks
- Props tipadas com interfaces TypeScript
- Serviços em `/services` — nunca `fetch`/`axios` direto em componentes
- Cada página em `/pages` corresponde a uma rota do React Router
- Modais fecham ao clicar fora ou pressionar ESC

### Laravel

- Controllers retornam JSON consistente via API Resources
- Validação via FormRequest
- Lógica de negócio em Services — controllers apenas delegam
- Nunca lógica pesada em controllers

## Padrões de UI

- **Glassmorphism:** `background: rgba(255,255,255,0.1)`, `backdrop-filter: blur(16px)`, borda `rgba(255,255,255,0.18)`
- **Cor Primária:** Verde `#1B5E20 / #2E7D32 / #4CAF50`
- **Cor Secundária:** Amarelo `#F9A825 / #FFD600 / #FFEB3B`
- **Gradiente de fundo:** `linear-gradient(135deg, #1B5E20, #2E7D32, #F9A825)`
- **Tipografia:** Inter (corpo), Poppins (títulos), Space Grotesk (mono)
- **Animações:** Transições de 0.3s, hover effects, fade-in em cards
- **Responsividade:** Mobile < 768px · Tablet 768–1024px · Desktop > 1024px

## Notificações e Erros

- **Toast de sucesso:** verde, auto-dismiss em 4s
- **Toast de erro:** vermelho, auto-dismiss em 4s
- **Toast informativo:** amarelo, auto-dismiss em 4s
- Nunca exibir "Error 500" — sempre traduzir para mensagem amigável em português
- Modais de confirmação para ações destrutivas

## Banco de Dados

Todas as tabelas devem ter:
```sql
$table->id();
$table->timestamps();
$table->softDeletes();
```

## Credenciais Demo

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | admin@admin.com | 123456 |
| João (Vendedor) | joao@email.com | 123456 |
| Maria (Compradora) | maria@email.com | 123456 |
