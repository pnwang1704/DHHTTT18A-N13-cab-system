# Quy tắc đóng góp – Cab Booking System

Cảm ơn bạn đã tham gia xây dựng **Cab Booking System** 🎉  
File này mô tả cách làm việc chung trong repo để mọi người dễ phối hợp.

---

## 1. Kiến trúc & Nguyên tắc chung

- Đây là **monorepo**: tất cả services nằm chung trong một repo.
- Mỗi microservice:
  - Có thư mục, `package.json`, `.env` và database **riêng**.
  - **Không share database** với service khác.
  - Giao tiếp với nhau qua:
    - HTTP API (sync)
    - Message broker / events (async) – sẽ bổ sung sau.
- API Gateway là entry point duy nhất cho client.
- Business logic phải nằm đúng service (vd: logic tính giá ở `pricing-service`, không để trong `booking-service`).

---

## 2. Branching model

### 2.1. Branch chính

- `main`
  - Luôn ở trạng thái **ổn định**, có thể deploy.
  - Không push trực tiếp, chỉ merge qua Pull Request (PR).

### 2.2. Quy ước đặt tên branch

- Feature: `feature/<service>-<mota>`
  - `feature/auth-login-register`
  - `feature/booking-create-endpoints`
- Bugfix: `fix/<service>-<mota>`
  - `fix/ride-status-transition`
- Chore/tooling/doc: `chore/<mota>`, `docs/<mota>`
  - `chore/add-eslint`
  - `docs/update-readme`

Ví dụ:

```bash
git checkout main
git pull origin main

git checkout -b feature/booking-create-endpoints
# ... code ...
git push -u origin feature/booking-create-endpoints
