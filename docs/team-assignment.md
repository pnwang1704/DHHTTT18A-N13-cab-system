# Phân công thành viên & microservices – Cab Booking System

## 1. Mục đích tài liệu

Tài liệu này mô tả **phân công công việc chi tiết** cho từng thành viên trong nhóm và **service** mà mỗi người phụ trách trong kiến trúc microservices của hệ thống Cab Booking System.

Mỗi người chịu trách nhiệm chính cho **01 service backend**, bao gồm:
- Triển khai API của service đó.
- Thiết kế dữ liệu nội bộ của service.
- Viết tài liệu API & tự kiểm thử.
- Phối hợp với các service liên quan qua API Gateway.

---

## 2. Phân công tổng quan

| STT | Owner  | Service phụ trách       | Nhóm chức năng chính                                 |
|-----|--------|-------------------------|------------------------------------------------------|
| 1   | Quang  | Gateway                 | Entry point, routing, auth middleware                |
| 2   | Bảo    | Auth Service            | Đăng ký/đăng nhập, JWT, phân quyền                  |
| 3   | Lộc    | User Service            | Hồ sơ người dùng (khách)                             |
| 4   | Thoại  | Driver Service          | Hồ sơ tài xế, trạng thái tài xế                      |
| 5   | Phát   | Booking Service         | Yêu cầu đặt xe, quản lý booking                      |
| 6   | Quân   | Ride Service            | Vận hành chuyến đi (ride lifecycle)                  |
| 7   | May    | Pricing Service         | Tính giá, chính sách giá                             |
| 8   | Đại    | Payment Service         | Thanh toán, giao dịch                                |
| 9   | Long   | Notification Service    | Gửi thông báo (email/push/in-app)                    |
| 10  | Hào    | Review Service          | Đánh giá & xếp hạng (review/rating)                  |

---

## 3. Quy ước làm việc chung

- Mỗi service nằm trong thư mục: `services/<service-name>-service`
- Cấu trúc chuẩn mỗi service:
  - `src/app.js` – cấu hình Express, mount routes, middleware.
  - `src/server.js` – khởi động service, đọc biến môi trường.
  - `src/controllers/` – controller nhận request, trả response.
  - `src/services/` – business logic.
  - `src/repositories/` – thao tác dữ liệu/DB.
  - `src/routes/` – định nghĩa endpoint.
  - `src/models/` – định nghĩa model/schema.
  - `src/config/` – cấu hình DB, config chung của service.
  - `src/middlewares/` – middleware (error handler, …).
  - `src/events/` – publisher/consumer (để mở rộng event-driven sau này).
- Làm việc với Git:
  - Luôn tạo branch mới từ `main`:
    - `feature/<service>-<task>`
    - Ví dụ: `feature/auth-login-api`, `feature/booking-create-endpoint`.
  - Không commit `node_modules` và file `.env`.
  - Mỗi task → 1 Pull Request vào `main`.

---

## 4. Phân công chi tiết theo service

### 4.1. API Gateway – Owner: **Quang** (Gateway)

**Mục tiêu:**  
Xây dựng điểm vào duy nhất cho toàn hệ thống, quản lý routing, xác thực, logging và xử lý lỗi chung.

**Phạm vi trách nhiệm:**

1. **Routing:**
   - Cấu hình route trong `api-gateway/src/routes/index.js`:
     - `/auth` → Auth Service
     - `/users` → User Service
     - `/drivers` → Driver Service
     - `/bookings` → Booking Service
     - `/rides` → Ride Service
     - `/pricing` → Pricing Service
     - `/payments` → Payment Service
     - `/notifications` → Notification Service
     - `/reviews` → Review Service

2. **Auth middleware:**
   - Triển khai `authMiddleware` sử dụng JWT (verify `userId`, `role`, thời gian hết hạn,…).
   - Xác định route nào **bắt buộc** có token (bookings, rides, payments, reviews, …) và route nào cho phép public (login, register, pricing estimate, health check,…).

3. **Cross-cutting concerns:**
   - Logging request/response (morgan hoặc logger khác).
   - Chuẩn hóa format lỗi trả về từ Gateway, ví dụ:
     ```json
     { "message": "...", "statusCode": 400, "timestamp": "...", "path": "/..." }
     ```
   - Xử lý 404, 500 chung.

4. **Tương thích với các service:**
   - Làm việc với Owner Auth để thống nhất format JWT, secret, thuật toán.
   - Đảm bảo các URL nội bộ (`AUTH_SERVICE_URL`, `BOOKING_SERVICE_URL`, …) khớp với port/service thực tế.

5. **Tài liệu & hỗ trợ:**
   - Viết README phần “Cách gọi API thông qua Gateway”.
   - Tạo Postman collection/Insomnia cho các API chính.

---

### 4.2. Auth Service – Owner: **Bảo**

**Mục tiêu:**  
Xử lý xác thực & cấp token cho người dùng (khách và tài xế).

**Phạm vi trách nhiệm:**

1. **API chính:**
   - `POST /auth/register` – đăng ký tài khoản.
   - `POST /auth/login` – đăng nhập, trả `accessToken` (và `refreshToken` nếu có).
   - (Tuỳ thời gian) `POST /auth/refresh`, `POST /auth/logout`.

2. **Bảo mật:**
   - Hash mật khẩu (BCrypt hoặc tương đương).
   - Validate dữ liệu đầu vào (email, password, role).
   - Quy ước payload JWT: `userId`, `role`, `iat`, `exp`, …

3. **Tích hợp với Gateway và các service khác:**
   - Thống nhất với Gateway về secret, thuật toán JWT, claim.
   - Đảm bảo token mà Auth phát hành được API Gateway verify được.

4. **Dữ liệu & DB:**
   - Thiết kế schema bảng/tài liệu user auth (riêng với User profile ở User Service).
   - Triển khai repository thao tác DB (có thể mock in-memory giai đoạn đầu).

5. **Tài liệu & test:**
   - Mô tả rõ flow đăng ký/đăng nhập, các mã lỗi đi kèm.
   - Viết test case cho các tình huống: mật khẩu sai, user không tồn tại, token hết hạn, …

---

### 4.3. User Service – Owner: **Lộc**

**Mục tiêu:**  
Quản lý hồ sơ người dùng (khách hàng sử dụng app đặt xe).

**Phạm vi trách nhiệm:**

1. **API chính:**
   - `GET /users/me` – lấy thông tin user hiện tại (dựa trên JWT qua Gateway).
   - `PUT /users/me` – cập nhật thông tin cá nhân: tên, số điện thoại, avatar, …
   - (Tuỳ nhu cầu) `GET /users/:id` – lấy profile người dùng bất kỳ (cho admin).

2. **Dữ liệu & DB:**
   - Thiết kế model User profile (không chứa password).
   - Liên kết `userId` với hệ thống Auth (thông qua ID chung).

3. **Quy tắc nghiệp vụ:**
   - Chỉ cho phép người dùng sửa thông tin của chính mình.
   - Validate dữ liệu (độ dài tên, định dạng số điện thoại, …).

4. **Tích hợp với các service khác:**
   - Cung cấp API để các service khác có thể tra cứu user info khi cần (nếu yêu cầu).

---

### 4.4. Driver Service – Owner: **Thoại**

**Mục tiêu:**  
Quản lý tài khoản & hồ sơ tài xế.

**Phạm vi trách nhiệm:**

1. **API chính:**
   - `GET /drivers/me` – tài xế xem profile của mình.
   - `PUT /drivers/me` – cập nhật thông tin tài xế (biển số, loại xe, giấy phép,…).
   - `PATCH /drivers/me/status` – cập nhật trạng thái online/offline.

2. **Dữ liệu:**
   - Model Driver: `driverId`, liên kết `userId/authId`, thông tin xe, giấy phép, rating tổng hợp, trạng thái (online/offline, active/inactive,…).

3. **Business rules:**
   - Chỉ tài xế ở trạng thái “hoạt động” và “online” mới có thể nhận chuyến.
   - Ràng buộc cập nhật thông tin khi đang có chuyến active (nếu có yêu cầu).

4. **Tích hợp:**
   - Cung cấp API để Booking/Ride Service kiểm tra trạng thái driver.
   - Sau này nhận dữ liệu rating tổng hợp từ Review Service.

---

### 4.5. Booking Service – Owner: **Phát**

**Mục tiêu:**  
Quản lý yêu cầu đặt xe của khách.

**Phạm vi trách nhiệm:**

1. **API chính:**
   - `GET /bookings` – danh sách booking của user hiện tại.
   - `POST /bookings` – tạo booking mới:
     - Input gợi ý: điểm đón, điểm đến, loại xe, phương thức thanh toán dự kiến, …
   - (Sau) `PATCH /bookings/:id/status` – cập nhật trạng thái booking.

2. **Trạng thái & logic:**
   - Trạng thái booking: `PENDING`, `ACCEPTED`, `CANCELLED`, `EXPIRED`, …
   - Luồng cơ bản: user tạo booking → booking ở `PENDING` → sau này driver nhận chuyến → `ACCEPTED`.

3. **Tích hợp Pricing & Ride:**
   - Gọi Pricing Service để lấy giá ước tính khi tạo booking (hoặc nhận từ client).
   - Thiết kế sẵn chỗ để khi booking confirmed có thể kích hoạt Ride Service.

4. **Dữ liệu:**
   - Model: `bookingId`, `userId`, `driverId` (có thể null), địa điểm, thời gian, giá ước tính, trạng thái.

---

### 4.6. Ride Service – Owner: **Quân**

**Mục tiêu:**  
Quản lý “chuyến đi thực tế” sau khi booking được nhận.

**Phạm vi trách nhiệm:**

1. **API chính:**
   - `POST /rides` – tạo ride mới (ban đầu có thể tạo trực tiếp từ client/booking).
   - `PATCH /rides/:id/start` – bắt đầu chuyến đi.
   - `PATCH /rides/:id/complete` – hoàn thành chuyến đi.
   - `PATCH /rides/:id/cancel` – huỷ chuyến.

2. **Trạng thái:**
   - Life cycle gợi ý: `CREATED`, `ONGOING`, `COMPLETED`, `CANCELLED`.
   - Kiểm tra hợp lệ khi chuyển trạng thái (không thể complete nếu chưa start,…).

3. **Tích hợp Booking & Payment:**
   - Lưu `bookingId`, `userId`, `driverId`.
   - Sau khi `COMPLETED` → là input cho Payment và Review.

4. **Test & chất lượng:**
   - Thiết kế nhiều test case cho các trạng thái và luồng lỗi (cancel giữa chừng, complete sớm, …).

---

### 4.7. Pricing Service – Owner: **May**

**Mục tiêu:**  
Tính giá chuyến đi.

**Phạm vi trách nhiệm:**

1. **API chính:**
   - `POST /pricing/estimate`
     - Input gợi ý: khoảng cách, thời gian dự kiến, loại xe, thời điểm trong ngày, …
     - Output: `estimatedPrice` + breakdown (base fare, per km, per minute,…).

2. **Logic tính toán:**
   - Xây dựng công thức giá cơ bản:
     - Giá mở cửa + giá theo km + giá theo phút + phụ phí (giờ cao điểm,…).
   - Cho phép cấu hình các hệ số (hardcode hoặc file config).

3. **Tích hợp:**
   - Đảm bảo Booking Service có thể gọi Pricing trước khi tạo booking.
   - Có thể lưu log lịch sử pricing để tiện debug/trace sau này.

4. **Mở rộng AI/ML (tương lai):**
   - Thiết kế API và cấu trúc code theo hướng dễ thay thế bằng model ML.

---

### 4.8. Payment Service – Owner: **Đại**

**Mục tiêu:**  
Quản lý thanh toán cho từng chuyến đi.

**Phạm vi trách nhiệm:**

1. **API chính (giai đoạn mock):**
   - `POST /payments`
     - Input: `rideId`, `amount`, `method` (cash, card, wallet).
     - Xử lý thanh toán giả lập, trả về transaction với trạng thái.
   - `GET /payments/:id` – xem chi tiết thanh toán.

2. **Trạng thái transaction:**
   - `PENDING`, `SUCCESS`, `FAILED`, `CANCELLED`.

3. **Tích hợp với Ride:**
   - Luồng gợi ý: ride `COMPLETED` → gọi Payment → `SUCCESS` → có thể review.

4. **Kiểm thử & SQA:**
   - Thiết kế test case: số tiền không hợp lệ, phương thức không hỗ trợ, thanh toán lặp lại, …

---

### 4.9. Notification Service – Owner: **Long**

**Mục tiêu:**  
Xử lý việc gửi thông báo tới người dùng & tài xế (mock giai đoạn đầu).

**Phạm vi trách nhiệm:**

1. **API giai đoạn 1 (HTTP):**
   - `POST /notifications/send`
     - Input: `toUserId`, `type` (email, in-app,…), `title`, `message`.
     - Hiện tại có thể chỉ log ra console.

2. **Thiết kế hướng event-driven:**
   - Định nghĩa các loại sự kiện sẽ nhận: `BookingCreated`, `RideStarted`, `RideCompleted`, …
   - Notification Service sau này sẽ subscribe các event này từ message broker.

3. **Loại thông báo gợi ý:**
   - Khách: khi tài xế nhận chuyến, khi chuyến hoàn thành, khi thanh toán thành công.
   - Tài xế: có booking mới, booking bị huỷ, …

4. **DevOps & quan sát:**
   - Log rõ ràng, cấu trúc để sau này dễ thu thập log/monitor.

---

### 4.10. Review Service – Owner: **Hào**

**Mục tiêu:**  
Quản lý đánh giá & xếp hạng cho tài xế/chuyến đi.

**Phạm vi trách nhiệm:**

1. **API chính:**
   - `POST /reviews`
     - Input: `rideId`, `rating` (1–5), `comment`, `target` (driver/user).
   - `GET /reviews?driverId=...` – lấy danh sách review cho tài xế.
   - (Có thể) `GET /reviews/summary?driverId=...` – trả điểm trung bình & số review.

2. **Thiết kế dữ liệu & UX:**
   - Lưu: người đánh giá, điểm số, nội dung, thời gian.
   - Cấu trúc response dễ hiển thị trên UI: phân trang, sort theo thời gian,…

3. **Tích hợp với Ride & Driver:**
   - Chỉ cho phép review nếu ride đã `COMPLETED`.
   - Cung cấp API để Driver Service lấy rating tổng hợp.

4. **Tài liệu:**
   - Mô tả format review, quy tắc tính rating (average, làm tròn,…).

---

## 5. Kết luận

Tài liệu này là cơ sở để:
- Mỗi thành viên biết rõ **service mình chịu trách nhiệm**.
- Nhóm dễ dàng **phân chia công việc theo sprint**.
- Giữ kiến trúc microservices nhất quán, tránh chồng chéo.

Mọi thay đổi phân công hoặc phạm vi service nên được cập nhật lại trong file này để cả nhóm theo dõi.
