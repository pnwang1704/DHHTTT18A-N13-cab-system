# Cab Booking System

Monorepo cho hệ thống **Cab Booking System** (ứng dụng đặt xe kiểu Grab/Uber) xây dựng trên kiến trúc **microservices** và **API Gateway**.

---

## 🧱 Kiến trúc tổng quan

### Thành phần chính

- **API Gateway**
  - Entry point duy nhất cho client (Web / Mobile).
  - Xử lý:
    - Xác thực JWT (Auth)
    - Logging
    - Routing request tới các microservice.

- **Microservices**
  - `auth-service`: Đăng ký / đăng nhập, phát JWT (Access/Refresh Token).
  - `user-service`: Quản lý thông tin khách hàng (profile).
  - `driver-service`: Quản lý tài xế, thông tin xe, trạng thái online/offline.
  - `booking-service`: Nhận yêu cầu đặt xe, tạo booking.
  - `ride-service`: Quản lý chuyến đi (start, complete, cancel).
  - `pricing-service`: Tính giá cước (khoảng cách, thời gian, surge…).
  - `payment-service`: Xử lý thanh toán, trạng thái giao dịch.
  - `notification-service`: Gửi thông báo (email/SMS/push…).
  - `review-service`: Đánh giá, rating khách/tài xế/chuyến đi.

> Mỗi service **sở hữu DB riêng**, không share database trực tiếp.

### Hạ tầng dự kiến

- **Database**:
  - PostgreSQL cho dữ liệu quan hệ (user, driver, booking, ride, payment…)
  - MongoDB cho dữ liệu linh hoạt (notification, log…)
  - Redis để cache (pricing, trạng thái real-time…)
- **Message Broker**:
  - Kafka hoặc RabbitMQ để truyền event giữa các services.

---

## 📁 Cấu trúc thư mục

Cấu trúc monorepo   :

```bash
cab-booking-system/
│
├── api-gateway/
│   ├── src/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── config/
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── services/
│   ├── auth-service/
│   ├── user-service/
│   ├── driver-service/
│   ├── booking-service/
│   ├── ride-service/
│   ├── pricing-service/
│   ├── payment-service/
│   ├── notification-service/
│   └── review-service/
│
├── shared/              # (tùy chọn) code dùng chung (logger, utils, error handling…)
│
├── docker-compose.yml   # (sau này thêm)
├── README.md
└── CONTRIBUTING.md

## Hướng dẫn cho từng thành viên: Bắt đầu làm việc với branch của mình

Mỗi service đã được tạo sẵn **01 branch riêng trên remote** theo format:

`feature/<tên-service>`

Ví dụ:

| Owner | Service              | Branch                     |
|-------|----------------------|----------------------------|
| Quang | Gateway              | `feature/gateway`          |
| Bảo   | Auth Service         | `feature/auth-service`     |
| Lộc   | User Service         | `feature/user-service`     |
| Thoại | Driver Service       | `feature/driver-service`   |
| Phát  | Booking Service      | `feature/booking-service`  |
| Quân  | Ride Service         | `feature/ride-service`     |
| May   | Pricing Service      | `feature/pricing-service`  |
| Đại   | Payment Service      | `feature/payment-service`  |
| Long  | Notification Service | `feature/notification-service` |
| Hào   | Review Service       | `feature/review-service`   |

> Chi tiết phân công xem thêm tại: `docs/team-assignment.md`

### 1. Clone repo lần đầu

git clone <LINK-REPO>
cd DHHTTT18A-N13-CAB-SYSTEM   # hoặc tên thư mục của bạn

###2. Lấy danh sách branch mới nhất

Lệnh:
git fetch
git checkout main
git pull origin main

###3. Checkout đúng branch của mình

--VD: Bảo làm Auth-Service (các thành viên khác tương tự cho các branch tương úng mình làm)
Lệnh:
git checkout feature/auth-service

###4. Vào đúng thư mục service và chạy dự án
# Đảm bảo đang ở branch feature/auth-service
git rev-parse --abbrev-ref HEAD   # kiểm tra, phải ra feature/auth-service

cd services/auth-service
cp .env.example .env      # tạo file .env từ template
npm install
npm run dev

###5. Quy trình commit & push
git status              # xem file đã sửa
git add .               # hoặc chọn file cụ thể
git commit -m "feat(<service>): mô tả ngắn gọn thay đổi"
git push origin <branch-của-bạn>
--VD: git push origin feature/auth-service


