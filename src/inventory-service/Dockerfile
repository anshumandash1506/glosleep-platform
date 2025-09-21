FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

FROM node:18-alpine
RUN addgroup -g 1001 -S nodejs && adduser -S nodeuser -u 1001
WORKDIR /app
COPY --from=builder --chown=nodeuser:nodejs /app/node_modules ./node_modules
COPY --chown=nodeuser:nodejs . .
USER nodeuser
EXPOSE 3001
CMD ["node", "server.js"]