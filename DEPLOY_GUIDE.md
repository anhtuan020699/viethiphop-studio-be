# 🚀 Hướng Dẫn Triển Khai (Deployment Guide) - VietHiphop Studio

Tài liệu này ghi chú lại toàn bộ các lệnh và quy trình chuẩn để phát triển nội bộ (Local) cũng như đẩy code lên Server (Production) cho dự án VietHiphop.
Do dự án dùng chung server với dự án Vin Bike, các cổng (Port) đã được đổi để tránh đụng độ:
- **Backend:** Cổng `3010` (trên Server) -> Map vào `3000` (trong Docker)
- **Frontend:** Cổng `3011` (trên Server) -> Map vào `80` (trong Docker Nginx)

---

## 1. Mô hình Mạng (Network Topology)
Dự án được chạy trên mô hình 2 máy chủ:
- **Server Gateway (113.171.156.73 / 192.168.1.190):** Đứng ngoài cùng, tiếp khách từ Internet, chạy `Nginx` và `Certbot` (HTTPS).
- **Server App (192.168.1.191 - matgpu):** Đứng giấu mặt bên trong mạng nội bộ, chạy `Docker Compose` chứa Backend (cổng 3010), Frontend (cổng 3011), Postgres (cổng 5432).

---

## 2. Phát triển nội bộ trên máy tính Windows (Local Dev)
Vì Database nằm trên Server 191 (không cho Internet kết nối thẳng), bạn phải dùng chiêu **SSH Port Forwarding** để lấy Database về máy tính cá nhân.

**Bước 1:** Mở 1 cửa sổ PowerShell mới tinh và gõ lệnh sau để mở đường hầm:
```bash
ssh -J root@113.171.156.73 -L 7435:localhost:5432 root@192.168.1.191
```
🚨 **QUAN TRỌNG:** Phải treo (thu nhỏ) cái cửa sổ này vĩnh viễn trong lúc code. Tắt nó là sập kết nối Database!

**Bước 2:** Chạy code như bình thường:
```bash
# Ở thư mục Backend:
npm run start:dev

# Ở thư mục Frontend:
npm run dev
```

---

## 3. Quy trình Đẩy Code mới lên Server (Deploy)

Mỗi khi bạn sửa code xong và muốn cập nhật lên Server thực tế, hãy làm đúng 2 chặng:

### Chặng 1: Đẩy code từ Windows lên Github
Tại thư mục chứa code trên máy Windows:
```bash
git add .
git commit -m "Ghi chú những gì bạn vừa sửa"
git push
```

### Chặng 2: Kéo code về Server và Build lại (Nướng bánh)

Đăng nhập vào con máy 191 (matgpu), đi vào thư mục dự án VietHiphop: `~/webapps/viet-hiphop-studio`.
*(Lưu ý: Nếu bị đòi Username/Password khi pull, hãy dùng Username là Github của bạn và Password là mã PAT Token).*

**1. Nếu bạn sửa Backend:**
```bash
cd ~/webapps/viet-hiphop-studio/viethiphop-studio-be
git pull
docker compose build --no-cache
docker compose up -d
```

**2. Nếu bạn sửa Frontend:**
*(Nhớ đảm bảo Frontend có file `.env` chứa `VITE_API_URL` trỏ về API Backend trước khi build).*
```bash
cd ~/webapps/viet-hiphop-studio/viethiphop-studio-fe
git pull
docker compose build --no-cache
docker compose up -d
```

### Chặng 3: Kiểm tra Log (Bắt bệnh)
Nếu build thành công nhưng web chưa lên hoặc gọi API bị lỗi, bạn có thể xem log:

**Kiểm tra xem Container có đang sống (Up) hay chết (Restarting):**
```bash
docker ps
```

**Xem nguyên nhân chết của Backend:**
```bash
cd ~/webapps/viet-hiphop-studio/viethiphop-studio-be
docker compose logs -f
```
*(Bấm `Ctrl + C` để thoát khỏi màn hình xem log)*

---

## 4. Cấu hình Nginx mẫu trên Server Gateway (190)

Đây là cấu hình mẫu trên con Nginx, hãy đổi `viethiphop.vn` bằng tên miền thật của bạn.

Mở file Nginx: `nano /etc/nginx/sites-available/default`

**Mẫu cho Backend API (`api.viethiphop.vn`):**
```nginx
server {
    server_name api.viethiphop.vn;

    location / {
        proxy_pass http://192.168.1.191:3010; # <-- CỔNG 3010 (ĐÃ ĐỔI ĐỂ KHÔNG ĐỤNG HÀNG)
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Mẫu cho Frontend (`viethiphop.vn` và `www`):**
```nginx
server {
    server_name viethiphop.vn www.viethiphop.vn;

    location / {
        proxy_pass http://192.168.1.191:3011; # <-- CỔNG 3011 (ĐÃ ĐỔI ĐỂ KHÔNG ĐỤNG HÀNG)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Sửa xong Nginx thì gõ: `systemctl restart nginx`

---

## 5. Cấp ổ khóa xanh (HTTPS/SSL)

Mỗi khi thêm một tên miền mới vào Nginx, bạn cần xin lại chứng chỉ SSL bằng lệnh Certbot (chạy trên máy Gateway 190):

```bash
certbot --nginx -d viethiphop.vn -d www.viethiphop.vn -d api.viethiphop.vn
```
*(Thay thế tên miền bằng đúng tên miền bạn cần xin SSL)*.
Nếu hệ thống báo lỗi, hãy lên trang mua tên miền kiểm tra xem đã trỏ bản ghi A (DNS) về IP `113.171.156.73` chưa. Chờ 5 phút rồi gõ lại lệnh là xanh!
