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

Cấu trúc monorepo:

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
