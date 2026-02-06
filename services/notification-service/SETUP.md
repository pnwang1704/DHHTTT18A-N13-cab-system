# SETUP.md - Hướng dẫn đẩy lên GitHub và clone về

## **📤 Đẩy lên GitHub**

### **Bước 1: Tạo Repository trên GitHub**

1. Truy cập https://github.com/new
2. Đặt tên repository: `notification-service`
3. Chọn **Public** hoặc **Private**
4. **KHÔNG** chọn "Initialize with README" (vì đã có sẵn)
5. Click **Create repository**

### **Bước 2: Initialize Git và Push**

**Trong PowerShell terminal:**

```powershell
cd C:\BigData\notification-service

# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: NestJS Notification Service with Kafka and MongoDB"

# Add remote (thay <username> bằng GitHub username của bạn)
git remote add origin https://github.com/<username>/notification-service.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### **Bước 3: Verify**

Refresh trang GitHub repository, bạn sẽ thấy toàn bộ code!

---

## **📥 Người khác Clone về và Chạy**

### **Bước 1: Clone Repository**

```bash
git clone https://github.com/<username>/notification-service.git
cd notification-service
```

### **Bước 2: Install Dependencies**

```bash
npm install
```

### **Bước 3: Cấu hình IP (Quan trọng!)**

**Nếu dùng Docker Desktop (Windows/Mac):**
- Giữ nguyên, không cần sửa gì

**Nếu dùng WSL/Linux:**
```bash
# Lấy IP của WSL
hostname -I | awk '{print $1}'
```

Sau đó update IP trong các file:
- `docker-compose.yml` (dòng 23)
- `src/main.ts` (dòng 9)
- `src/app.module.ts` (dòng 12)
- `scripts/trigger-event.ts` (dòng 5)

### **Bước 4: Start Infrastructure**

```bash
# Start Docker containers
docker compose up -d

# Wait 15 seconds
sleep 15

# Verify
docker ps
```

### **Bước 5: Build & Run**

```bash
npm run build
npm run start:dev
```

### **Bước 6: Test**

```bash
# Terminal mới
npx ts-node scripts/trigger-event.ts
```

---

## **🎯 Summary Commands cho Người Clone**

```bash
git clone https://github.com/<username>/notification-service.git
cd notification-service
npm install
docker compose up -d
sleep 15
npm run build
npm run start:dev
```

Xong! Service sẽ chạy ngay.

---

## **⚠️ Lưu ý quan trọng**

1. **IP Configuration**: WSL users phải update IPs
2. **Docker**: Phải có Docker đang chạy
3. **Ports**: Đảm bảo ports 9092, 27017, 2181 không bị chiếm
4. **Node.js**: Cần Node.js v18+

---

## **🔄 Update Code và Push**

```bash
# Sau khi sửa code
git add .
git commit -m "Your commit message"
git push origin main
```

Người khác pull về:

```bash
git pull origin main
npm install  # Nếu có dependency mới
npm run build
```
