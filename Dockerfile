# Stage 1: Build
FROM node:18-alpine AS builder

# Thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ source code
COPY . .

# Build project NestJS
RUN npm run build

# Stage 2: Run
FROM node:18-alpine

WORKDIR /app

# Copy package.json và package-lock.json (chỉ để cài production deps)
COPY package*.json ./

# Cài production dependencies
RUN npm install --production

# Copy mã đã build từ stage builder
COPY --from=builder /app/dist ./dist

# Copy các file cần thiết (nếu có)
# COPY --from=builder /app/prisma ./prisma
# COPY --from=builder /app/.env ./

# Mở port ứng dụng (mặc định NestJS dùng 3000)
EXPOSE 3000

# Start app
CMD ["node", "dist/main.js"]
