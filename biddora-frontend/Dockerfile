# Build stage
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install --production=false || yarn install || pnpm install

# Copy source
COPY . .

# Build Vite app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a default nginx config (optional override)
# If you add a custom config, place it at nginx.conf in this folder
# and uncomment the line below.
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
