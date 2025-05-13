# Stage 1: Build the Angular application
FROM node:16 AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Install Angular CLI globally
RUN npm install -g @angular/cli@16

# Copy the application code
COPY . .

# Build the Angular application
RUN ng build CabinetMedical --configuration production

# Stage 2: Serve the application with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist/cabinet-medical /usr/share/nginx/html

# Optional: If you want Angular routing to work with Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]

