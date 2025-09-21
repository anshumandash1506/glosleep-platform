FROM node:18-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

FROM node:18-slim
RUN adduser --system --group --no-create-home --uid 1001 nodeuser
WORKDIR /app
COPY --from=builder --chown=nodeuser:nodejs /app/node_modules ./node_modules
COPY --chown=nodeuser:nodejs . .
USER nodeuser
EXPOSE 3001
CMD ["node", "server.js"]