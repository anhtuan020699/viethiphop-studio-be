# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Cài đặt thư viện openssl (Prisma cần cái này để chạy trên Alpine)
RUN apk add --no-cache openssl

# Copy file cấu hình package và thư mục prisma
COPY package*.json ./
COPY prisma ./prisma/

# Cài đặt TẤT CẢ thư viện (bao gồm cả dev để build)
RUN npm ci

# Copy toàn bộ source code vào
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build ứng dụng NestJS (biến TypeScript thành JavaScript trong thư mục dist)
RUN npm run build

# ==========================================
# Stage 2: Production (Chạy thực tế)
# ==========================================
FROM node:24-alpine AS production

WORKDIR /app

# Cài đặt thư viện openssl cho môi trường chạy
RUN apk add --no-cache openssl

# Đặt biến môi trường báo hiệu đây là production
ENV NODE_ENV=production

# Copy các file cấu hình
COPY package*.json ./
COPY prisma ./prisma/

# CHỈ cài đặt các thư viện cần thiết cho production (nhẹ hơn rất nhiều)
RUN npm ci --omit=dev

# Generate lại Prisma Client cho production
RUN npx prisma generate

# Copy thư mục build đã được biên dịch xong từ bước Builder sang đây
COPY --from=builder /app/dist ./dist

# Mở cổng 3000 để giao tiếp với Nginx/Host
EXPOSE 3000

# Lệnh khởi chạy ứng dụng
CMD ["node", "-r", "tsconfig-paths/register", "dist/src/main.js"]
