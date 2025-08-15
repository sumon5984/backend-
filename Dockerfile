
# Railway Docker (optional) — Nixpacks also works if you skip this.
FROM node:20-slim

WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install

COPY tsconfig.json ./
COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src

EXPOSE 3000
CMD ["npm", "run", "dev"]
