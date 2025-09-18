# Dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

# install deps
COPY package.json package-lock.json* ./
RUN npm install --production

COPY . .

# build TS (we will run via ts-node-dev for dev demo)
RUN npm run build || true

EXPOSE 3000
CMD ["node", "dist/index.js"]
# alternativ: ["npm","run","start"] if you want ts-node-dev behavior in dev
