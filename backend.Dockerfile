
FROM node:18-alpine AS backend-builder

WORKDIR /app


COPY backend/package.json backend/package-lock.json ./


RUN npm ci


COPY backend .


RUN npm run build


FROM node:18-alpine AS backend

WORKDIR /app


COPY --from=backend-builder /app/dist ./dist
COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/package.json ./package.json


EXPOSE 3001


CMD ["npm", "run", "start:prod"]