# Frontend Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Use a lightweight web server to serve the build
RUN npm install -g serve
EXPOSE 3001
CMD ["serve", "-s", "build"]
