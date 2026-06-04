DC = docker compose
APP = $(DC) exec app
GREEN = \033[0;32m
YELLOW = \033[1;33m
NC = \033[0m

.PHONY: up up-prod down install migrate seed fresh shell db thinker send deploy build logs

up:
	@echo "$(GREEN)Iniciando ambiente de desenvolvimento...$(NC)"
	$(DC) down --remove-orphans
	$(DC) up -d
	@echo "$(GREEN)Ambiente iniciado! API: http://localhost:8080 | Frontend: npm run dev$(NC)"

up-prod:
	@echo "$(GREEN)Iniciando ambiente de produção...$(NC)"
	docker compose -f docker-compose.prod.yml down --remove-orphans
	docker compose -f docker-compose.prod.yml up -d
	@echo "$(GREEN)Produção iniciada!$(NC)"

down:
	$(DC) down --remove-orphans

install:
	@echo "$(YELLOW)Instalando projeto...$(NC)"
	@if [ ! -f backend/artisan ]; then \
		echo "$(YELLOW)Criando projeto Laravel...$(NC)"; \
		docker run --rm -v "$$(pwd)/backend:/app" -w /app composer:latest \
			composer create-project laravel/laravel . --prefer-dist --no-interaction; \
	fi
	$(DC) up -d
	@sleep 5
	@echo "$(YELLOW)Instalando dependências PHP...$(NC)"
	$(APP) composer require laravel/sanctum --no-interaction
	@echo "$(YELLOW)Configurando .env...$(NC)"
	@cp -n backend/.env.example backend/.env || true
	$(APP) php artisan key:generate
	@echo "$(YELLOW)Configurando banco de dados...$(NC)"
	$(MAKE) migrate
	$(MAKE) seed
	@echo "$(YELLOW)Instalando dependências Node...$(NC)"
	npm install
	@echo "$(GREEN)Projeto instalado com sucesso!$(NC)"

migrate:
	$(APP) php artisan migrate --force

seed:
	$(APP) php artisan db:seed --force

fresh:
	$(APP) php artisan migrate:fresh --seed

shell:
	$(DC) exec -it app bash

db:
	$(DC) exec -it db mysql -ufigurinhas -psecret figurinhas

thinker:
	$(APP) php artisan tinker

logs:
	$(DC) logs -f app

build:
	npm run build

send:
	@echo "$(YELLOW)Executando lint...$(NC)"
	npm run lint || true
	@read -p "Mensagem do commit: " msg; \
	BRANCH="auto/$$(date +%Y%m%d-%H%M%S)"; \
	git checkout -b $$BRANCH; \
	git add -A; \
	if git diff --cached --quiet; then \
		echo "$(YELLOW)Nada para commitar.$(NC)"; \
		git checkout main; \
		git branch -d $$BRANCH; \
		exit 0; \
	fi; \
	git commit -m "$$msg"; \
	git push origin $$BRANCH; \
	git checkout main; \
	git merge $$BRANCH; \
	git push origin main; \
	git branch -d $$BRANCH; \
	echo "$(GREEN)Enviado com sucesso!$(NC)"

deploy:
	@echo "$(GREEN)Iniciando deploy...$(NC)"
	git stash || true
	git pull origin main
	$(MAKE) deploy-full

deploy-full:
	@START=$$(date +%s); \
	echo "$(GREEN)[1/6] Preparando ambiente...$(NC)"; \
	chmod -R 775 backend/storage backend/bootstrap/cache 2>/dev/null || true; \
	echo "$(GREEN)[2/6] Instalando dependências PHP...$(NC)"; \
	$(APP) composer install --no-dev --optimize-autoloader --no-interaction; \
	echo "$(GREEN)[3/6] Compilando frontend...$(NC)"; \
	$(DC) run --rm node sh -c "npm install && npm run build" || (echo "Build falhou! Abortando." && exit 1); \
	echo "$(GREEN)[4/6] Ativando manutenção...$(NC)"; \
	DOWN_START=$$(date +%s); \
	$(APP) php artisan down --secret="figurinhas-secret-2026" --retry=10; \
	echo "$(GREEN)[5/6] Migrando banco e atualizando caches...$(NC)"; \
	$(APP) php artisan migrate --force; \
	$(APP) php artisan config:cache; \
	$(APP) php artisan route:cache; \
	$(APP) php artisan view:clear; \
	$(APP) php artisan view:cache; \
	$(APP) php artisan storage:link; \
	docker compose -f docker-compose.prod.yml up -d --force-recreate app scheduler queue; \
	$(APP) php artisan up; \
	END=$$(date +%s); \
	echo "$(GREEN)[6/6] Deploy concluído em $$((END-START))s!$(NC)"; \
	echo "{\"version\":\"$$(git rev-parse --short HEAD)\",\"date\":\"$$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" > backend/public/version.json

deploy-rebuild:
	docker compose -f docker-compose.prod.yml build
	docker compose -f docker-compose.prod.yml up -d app
	$(MAKE) deploy-full
