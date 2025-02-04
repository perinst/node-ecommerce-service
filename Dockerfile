FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci 

COPY tsconfig.json ./
COPY src/ ./src/

RUN npm run build

FROM  node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY --from=builder /app/dist ./dist

RUN npm ci --only=production

EXPOSE 3888

CMD ["npm", "start"]
