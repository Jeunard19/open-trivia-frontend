### Stage 1: Build React App
FROM node:18-alpine AS builder
WORKDIR /app
# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

### Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy built assets
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
