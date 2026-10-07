# 🚀 Hướng Dẫn Triển Khai (Deployment Guide) - VietHiphop Studio

Tài liệu này ghi chú lại toàn bộ các lệnh và quy trình chuẩn để phát triển nội bộ (Local) cũng như đẩy code lên Server (Production) cho dự án VietHiphop.
Do dự án dùng chung server với dự án Vin Bike, một số cấu trúc mạng tương tự nhưng sẽ thay đổi port và domain.

---

## 1. Mô hình Mạng (Network Topology)
Dự án được chạy trên mô hình 2 máy chủ:
- **Server Gateway (113.171.156.73 / 192.168.1.190):** Đứng ngoài cùng, tiếp khách từ Internet, chạy `Nginx` và `Certbot` (HTTPS).
- **Server App (192.168.1.191 - matgpu):** Đứng giấu mặt bên trong mạng nội bộ, chạy `Docker Compose` chứa Backend (ví dụ cổng 3000), Frontend (ví dụ cổng 3001), Postgres, Redis.

*(Lưu ý: Port thực tế cần check trong file `docker-compose.yml` của dự án trên Server, ở đây giả sử BE là 3000, FE là 3001 để tránh trùng với port 7040/7005 của Vin Bike)*.

---

## 2. Phát triển nội bộ trên máy tính Windows (Local Dev)
Vì Database nằm trên Server 191 (không cho Internet kết nối thẳng), bạn phải dùng chiêu **SSH Port Forwarding** để lấy Database về máy tính cá nhân.

**Bước 1:** Mở 1 cửa sổ PowerShell mới tinh và gõ lệnh sau để mở đường hầm:
```bash
ssh -J root@113.171.156.73 -L 5432:localhost:5432 -L 6379:localhost:6379 root@192.168.1.191
```
*(Đổi port 5432/6379 nếu trên server đang chạy port khác cho db của VietHiphop. Nhập mật khẩu của Gateway 73 trước, rồi nhập mật khẩu của máy 191 sau).*
🚨 **QUAN TRỌNG:** Phải treo (thu nhỏ) cái cửa sổ này vĩnh viễn trong lúc code. Tắt nó là sập kết nối Database!

**Bước 2:** Mở cửa sổ PowerShell/Terminal thứ 2 (hoặc trong VS Code) để code bình thường:
```bash
npm run start:dev
```

---

## 3. Quy trình Đẩy Code mới lên Server (Deploy)

Mỗi khi bạn sửa code xong và muốn Web cập nhật, hãy làm đúng 2 chặng:

### Chặng 1: Đẩy code từ Windows lên Github
Tại thư mục chứa code trên máy Windows:
```bash
git add .
git commit -m "Ghi chú những gì bạn vừa sửa vào đây"
git push
```

### Chặng 2: Kéo code về Server và Build lại (Nướng bánh)

Đăng nhập vào con máy 191 (matgpu), đi vào thư mục dự án VietHiphop.
*(Giả sử thư mục code trên server là `/root/webapps/viethiphop`)*.

**1. Nếu bạn sửa Backend:**
```bash
cd /root/webapps/viethiphop/viethiphop-be
git pull
cd ..
docker compose build --no-cache viethiphop-be
docker compose up -d viethiphop-be
```

**2. Nếu bạn sửa Frontend:**
```bash
cd /root/webapps/viethiphop/VietHiphop-fe
git pull
cd ..
docker compose build --no-cache viethiphop-fe
docker compose up -d viethiphop-fe
```

### Chặng 3: Kiểm tra Log (Bắt bệnh)
Nếu build thành công, báo `Started` nhưng web chưa lên hoặc gọi API bị lỗi, bạn có thể xem log:

Xem log của Backend:
```bash
docker compose logs -f viethiphop-be
```

Xem log của Frontend:
```bash
docker compose logs -f viethiphop-fe
```
*(Bấm `Ctrl + C` để thoát khỏi màn hình xem log)*

---

## 4. Cấu hình Nginx mẫu trên Server Gateway (190)

Đây là cấu hình mẫu trên con Nginx, thay `viethiphop.vn` bằng tên miền thật của bạn.

Mở file Nginx: `nano /etc/nginx/sites-available/default`

**Mẫu cho Backend API (`api.viethiphop.vn`):**
```nginx
server {
    server_name api.viethiphop.vn;

    location / {
        proxy_pass http://192.168.1.191:3000;
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
        proxy_pass http://192.168.1.191:3001;
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
