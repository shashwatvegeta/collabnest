
FROM node:18-alpine AS frontend-builder

WORKDIR /app


COPY frontend/package.json frontend/package-lock.json ./


RUN npm ci


COPY frontend .


RUN npm run build


FROM node:18-alpine AS frontend

WORKDIR /app


COPY --from=frontend-builder /app/.next ./.next
COPY --from=frontend-builder /app/public ./public
COPY --from=frontend-builder /app/node_modules ./node_modules
COPY --from=frontend-builder /app/package.json ./package.json

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]