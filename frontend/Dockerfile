# Stage 1: Build React/Vite Static Assets
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci || npm install

# Copy application source and build bundle
COPY . .
RUN npm run build

# Stage 2: Production Non-Root NGINX Runtime
FROM nginxinc/nginx-unprivileged:alpine

# Copy custom reverse-proxy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose non-root port 8080
EXPOSE 8080

USER 101

CMD ["nginx", "-g", "daemon off;"]
