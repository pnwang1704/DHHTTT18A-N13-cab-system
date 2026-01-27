# API Gateway – User Context & Forward Header

Tài liệu này giải thích cách **API Gateway** truyền thông tin người dùng xuống các microservice thông qua **HTTP header**.

## 1. Mục đích

- Gateway là nơi **verify JWT** (token) một lần.
- Sau khi verify thành công, Gateway **không bắt microservice decode JWT lại**.
- Thay vào đó, Gateway sẽ **forward thông tin user** xuống service thông qua 3 header:

- `x-user-id`
- `x-user-email`
- `x-user-role`

Tất cả microservice phía sau **chỉ cần đọc các header này** để biết ai đang gọi API.

---

## 2. Các header được Gateway forward

Khi request đi qua `authMiddleware` và token hợp lệ, Gateway sẽ set 3 header sau:

- `x-user-id`
  - Kiểu: string / number
  - Ý nghĩa: ID của user (lấy từ payload JWT `userId`)
- `x-user-email`
  - Kiểu: string
  - Ý nghĩa: email đăng nhập của user
- `x-user-role`
  - Kiểu: string
  - Ví dụ: `USER`, `DRIVER`, `ADMIN`
  - Dùng để phân quyền trong từng service

Ví dụ header khi request đã qua Gateway:

```http
GET /bookings HTTP/1.1
Host: booking-service
x-user-id: 1
x-user-email: user@example.com
x-user-role: USER
````

---

## 3. Cách sử dụng trong microservice

### 3.1. Node.js / Express

Trong mỗi service, ở controller hoặc middleware, có thể đọc:

```js
function exampleHandler(req, res) {
  const userId = req.headers['x-user-id'];
  const userEmail = req.headers['x-user-email'];
  const userRole = req.headers['x-user-role'];

  // TODO: dùng userId, userRole để kiểm tra quyền hoặc filter dữ liệu
  res.json({ userId, userEmail, userRole });
}
```

**Lưu ý:**

* Header trong Express luôn là **chữ thường** (`req.headers['x-user-id']`), dù khi set là `x-user-id`.
* Các service **không decode JWT nữa**, chỉ tin vào header do Gateway gửi.

---

## 4. Yêu cầu đối với Auth Service

Để Gateway có thể set các header trên, Auth Service cần trả JWT với payload tối thiểu:

```json
{
  "userId": 1,
  "email": "user@example.com",
  "role": "USER",
  "iat": 1234567890,
  "exp": 1234569999
}
```

* `JWT_SECRET` ở **Auth Service** và **Gateway** phải giống nhau.
* Sau khi login thành công, Auth Service nên trả về:

```json
{
  "message": "Login success",
  "accessToken": "<JWT>",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "USER"
  }
}
```

Gateway sẽ nhận `accessToken`, verify, rồi forward `x-user-id`, `x-user-email`, `x-user-role` cho các service khác.

---

## 5. Tóm tắt cho dev trong team

* Khi viết **User/Driver/Booking/Ride/Payment/Review Service**:

  * Không cần xử lý JWT.
  * Chỉ cần đọc `req.headers['x-user-id']`, `req.headers['x-user-role']`.
* Khi viết **Auth Service**:

  * Đảm bảo JWT payload có `userId`, `email`, `role`.
  * Dùng chung `JWT_SECRET` với Gateway.

