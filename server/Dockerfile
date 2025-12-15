# Stage 1: Node.js Backend
FROM node:25-alpine
RUN apk update && apk upgrade --no-cache

# Install Docker CLI
RUN apk add --no-cache docker

WORKDIR /app

# Copy package.json e install dependencies
COPY package*.json ./
RUN npm install

# Copy backend source code
COPY . .

# Create temp directory
RUN mkdir -p temp

EXPOSE 4000 4001

CMD ["node", "src/server.js"]
