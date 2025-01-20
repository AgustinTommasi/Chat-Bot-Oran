# Filename: Dockerfile

FROM node:21

# Install chromium
RUN apt-get update && apt-get install -y chromium

# Set user to node
USER node

# Set the working directory
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# Copy package.json and install dependencies
COPY --chown=node:node ./package.json ./
RUN npm install

# Install puppeteer
# RUN node node_modules/puppeteer/install.mjs

# Copy the application code
COPY --chown=node:node ./ ./

# Compile TypeScript to JavaScript
RUN npm run build

# Verificar que los archivos se hayan copiado y compilado correctamente
RUN ls -la /home/node/app/src
RUN ls -la /home/node/app/dist

# Expose port 12345
EXPOSE 12345

# Start the application
CMD ["node", "dist/index.js"]

## docker build -f Dockerfile.dev -t agustintommasi:chat-bot .

## docker run -it -p 3000:3000 -v /home/node/app/node_modules -v /home/agustintommasi/chat-bot:/home/node/app agustintommasi:chat-bot
