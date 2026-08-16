# =========================================================
# Multi-stage Dockerfile para Quasar Frontend (AVA UniVC)
# =========================================================

# 1. Estágio de Build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV API_BASE_URL=${API_BASE_URL}
ENV BASE_URL=${BASE_URL}

RUN npm run build

# 2. Estágio de Servidor Nginx em Produção
FROM nginx:alpine AS runner

# Copia build SPA para a pasta do Nginx
COPY --from=builder /app/dist/spa /usr/share/nginx/html

# Copia configuração SPA com regras de roteamento
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
