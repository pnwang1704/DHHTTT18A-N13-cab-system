# ARCHITECTURE.md - Kiến trúc Cab Booking System

## **🏗️ Tổng Quan Kiến Trúc Microservices**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER (Frontend)                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐              ┌──────────────┐                        │
│  │ Mobile App   │              │ Driver App   │                        │
│  │ (Customer)   │              │ (Driver)     │                        │
│  │              │              │              │                        │
│  │ React Native │              │ React Native │                        │
│  │ Flutter      │              │ Flutter      │                        │
│  └──────┬───────┘              └──────┬───────┘                        │
│         │                             │                                │
│         │ HTTP/REST                   │ HTTP/REST                      │
│         │ WebSocket                   │ WebSocket                      │
└─────────┼─────────────────────────────┼────────────────────────────────┘
          │                             │
          ↓                             ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                       API GATEWAY LAYER                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │                    API Gateway (NestJS)                       │    │
│  │                                                               │    │
│  │  • Authentication (JWT)                                       │    │
│  │  • Rate Limiting                                              │    │
│  │  • Request Routing                                            │    │
│  │  • Load Balancing                                             │    │
│  │  • WebSocket Gateway (real-time updates)                      │    │
│  └───┬───────────┬───────────┬───────────┬───────────┬──────────┘    │
│      │           │           │           │           │                │
└──────┼───────────┼───────────┼───────────┼───────────┼────────────────┘
       │           │           │           │           │
       │ HTTP      │ HTTP      │ HTTP      │ HTTP      │ HTTP
       ↓           ↓           ↓           ↓           ↓
┌──────────────────────────────────────────────────────────────────────────┐
│                      MICROSERVICES LAYER                                 │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  User    │  │   Ride   │  │ Driver   │  │ Payment  │  │Notification│
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │  │  Service  │ │
│  │          │  │          │  │          │  │          │  │           │ │
│  │ Port:    │  │ Port:    │  │ Port:    │  │ Port:    │  │ Kafka     │ │
│  │ 3001     │  │ 3002     │  │ 3003     │  │ 3004     │  │ Consumer  │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬──────┘ │
│       │             │             │             │             │        │
│       │ Postgres    │ Postgres    │ MongoDB     │ Postgres    │ MongoDB│
│       ↓             ↓             ↓             ↓             ↓        │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│  │  Users  │  │  Rides  │  │ Drivers │  │Payments │  │Notifica-│    │
│  │   DB    │  │   DB    │  │   DB    │  │   DB    │  │ tions DB│    │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘    │
│                                                                        │
└────────────────────────┬───────────────────────────────┬──────────────┘
                         │                               │
                         │ Publish Events                │ Subscribe
                         ↓                               ↓
┌──────────────────────────────────────────────────────────────────────────┐
│                      MESSAGE BROKER (Kafka)                              │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Topics:                                                                 │
│  • user.created                                                          │
│  • ride.requested                                                        │
│  • ride.assigned         ←── Ride Service publishes                     │
│  • ride.started                                                          │
│  • ride.completed                                                        │
│  • payment.initiated                                                     │
│  • payment.completed     ←── Payment Service publishes                  │
│  • driver.location       (real-time tracking)                           │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## **🔄 Luồng Hoạt Động Thực Tế**

### **Scenario 1: Customer Đặt Xe**

```
1. Customer mở app → Request ride
   ↓
2. Mobile App → API Gateway (POST /rides)
   ↓
3. API Gateway → Ride Service (HTTP)
   ↓
4. Ride Service:
   - Lưu vào Rides DB
   - Tìm driver phù hợp
   - Publish "ride.requested" event → Kafka
   ↓
5. Driver Service (Subscribe Kafka):
   - Nhận "ride.requested"
   - Notify drivers gần đó
   - Driver accept → Publish "ride.assigned"
   ↓
6. Notification Service (Subscribe Kafka):
   - Nhận "ride.assigned" event
   - Lưu vào DB
   - Gửi notification cho Customer: "Driver John đã nhận chuyến"
   ↓
7. API Gateway (WebSocket):
   - Push real-time update → Mobile App
   - Customer thấy thông tin driver ngay lập tức
```

---

### **Scenario 2: Hoàn Thành Chuyến Đi**

```
1. Driver kết thúc chuyến trong app
   ↓
2. Driver App → API Gateway (PUT /rides/:id/complete)
   ↓
3. API Gateway → Ride Service
   ↓
4. Ride Service:
   - Update ride status = "completed"
   - Tính toán fare (giá cước)
   - Publish "ride.completed" event → Kafka
   ↓
5. Payment Service (Subscribe Kafka):
   - Nhận "ride.completed"
   - Tính toán payment
   - Charge customer
   - Publish "payment.completed" event → Kafka
   ↓
6. Notification Service (Subscribe Kafka):
   - Nhận "payment.completed"
   - Gửi notification cho Driver: "Bạn nhận $25.50"
   - Gửi notification cho Customer: "Thanh toán thành công $25.50"
   ↓
7. API Gateway (WebSocket):
   - Push updates → Both apps
```

---

## **📱 Frontend Mobile Kết Nối Backend**

### **Cách 1: HTTP REST API (Request-Response)**

**Mobile App sử dụng Axios/Fetch:**

```typescript
// Customer App (React Native/Flutter)

// 1. Login
const response = await fetch('http://api-gateway.com/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
const { token } = await response.json();

// 2. Request Ride
const rideResponse = await fetch('http://api-gateway.com/rides', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    pickupLocation: { lat: 10.762622, lng: 106.660172 },
    dropoffLocation: { lat: 10.762622, lng: 106.660172 }
  })
});
const ride = await rideResponse.json();
```

---

### **Cách 2: WebSocket (Real-time Updates)**

**Mobile App subscribe real-time events:**

```typescript
// Customer App
import { io } from 'socket.io-client';

const socket = io('http://api-gateway.com', {
  auth: { token: userToken }
});

// Listen for driver location updates
socket.on('driver.location', (data) => {
  console.log('Driver moved:', data);
  // Update map marker
  updateDriverMarker(data.lat, data.lng);
});

// Listen for ride status changes
socket.on('ride.status', (data) => {
  if (data.status === 'assigned') {
    showNotification('Driver accepted your ride!');
  }
});
```

---

## **🔗 Services Communicate Như Thế Nào?**

### **1. Synchronous Communication (HTTP)**

**Khi cần response ngay:**

```typescript
// API Gateway gọi User Service
const user = await axios.get('http://user-service:3001/users/123', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// API Gateway gọi Ride Service
const ride = await axios.post('http://ride-service:3002/rides', {
  customerId: user.id,
  pickup: location
});
```

**Pros:** Đơn giản, nhận response ngay  
**Cons:** Services phụ thuộc nhau, nếu 1 service down → toàn bộ fail

---

### **2. Asynchronous Communication (Kafka)**

**Khi không cần response ngay, xử lý background:**

```typescript
// Ride Service publish event
await kafkaProducer.send({
  topic: 'ride.assigned',
  messages: [{
    value: JSON.stringify({
      rideId: '123',
      customerId: 'customer-456',
      driverName: 'John Doe'
    })
  }]
});

// Notification Service subscribe
@EventPattern('ride.assigned')
handleRideAssigned(data: any) {
  // Process asynchronously
  this.sendNotification(data);
}
```

**Pros:** Loosely coupled, scalable, resilient  
**Cons:** Eventual consistency, phức tạp hơn

---

## **🎯 Ví Dụ Cụ Thể: Complete Flow**

### **User đặt xe → Nhận notification**

```
┌─────────┐     ┌──────────┐     ┌────────┐     ┌─────────┐     ┌──────────┐
│ Mobile  │────▶│   API    │────▶│  Ride  │────▶│  Kafka  │────▶│Notification│
│   App   │     │ Gateway  │     │Service │     │         │     │  Service   │
└─────────┘     └──────────┘     └────────┘     └─────────┘     └──────────┘
     │               │                 │              │               │
     │ POST /rides   │                 │              │               │
     │──────────────▶│                 │              │               │
     │               │ Forward         │              │               │
     │               │────────────────▶│              │               │
     │               │                 │ Save to DB   │               │
     │               │                 │─────┐        │               │
     │               │                 │     │        │               │
     │               │                 │◀────┘        │               │
     │               │                 │              │               │
     │               │                 │ Publish      │               │
     │               │                 │ "ride.assigned"              │
     │               │                 │─────────────▶│               │
     │               │                 │              │ Consume       │
     │               │                 │              │──────────────▶│
     │               │                 │              │               │
     │               │                 │              │ Save to MongoDB
     │               │                 │              │ Log to console
     │               │                 │              │               │
     │◀── WebSocket ─│◀── Notify ─────│              │               │
     │ "Driver John  │                 │              │               │
     │  accepted!"   │                 │              │               │
```

---

## **🛠️ Tech Stack Đầy Đủ**

### **Frontend (Mobile)**
- React Native / Flutter
- Socket.IO Client (real-time)
- Axios / Fetch (HTTP)
- Redux / MobX (state management)

### **API Gateway**
- NestJS
- JWT Authentication
- WebSocket (Socket.IO)
- Rate Limiting (express-rate-limit)

### **Microservices**
- **User Service**: Authentication, profiles (PostgreSQL)
- **Ride Service**: Ride management, matching (PostgreSQL)
- **Driver Service**: Driver tracking, availability (MongoDB)
- **Payment Service**: Transactions, invoices (PostgreSQL)
- **Notification Service**: Push notifications (MongoDB) ✅ ← BẠN ĐÃ BUILD

### **Infrastructure**
- **Message Broker**: Kafka
- **Databases**: PostgreSQL, MongoDB
- **Cache**: Redis
- **Containerization**: Docker, Kubernetes

---

## **📊 Database Schemas Liên Quan**

### **Ride Service (PostgreSQL)**
```sql
CREATE TABLE rides (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL,
  driver_id UUID,
  pickup_lat DECIMAL,
  pickup_lng DECIMAL,
  dropoff_lat DECIMAL,
  dropoff_lng DECIMAL,
  status VARCHAR(20), -- requested, assigned, started, completed
  fare DECIMAL(10,2),
  created_at TIMESTAMP,
  completed_at TIMESTAMP
);
```

### **Payment Service (PostgreSQL)**
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  ride_id UUID NOT NULL,
  customer_id UUID NOT NULL,
  driver_id UUID NOT NULL,
  amount DECIMAL(10,2),
  status VARCHAR(20), -- pending, completed, failed
  payment_method VARCHAR(50),
  created_at TIMESTAMP
);
```

### **Notification Service (MongoDB)** ✅
```javascript
{
  userId: "customer-123",
  title: "Ride Assigned",
  message: "Driver John accepted your ride",
  type: "ride.assigned",
  createdAt: ISODate("2026-02-05T10:30:00Z")
}
```

---

## **🚀 Tại Sao Dùng Microservices?**

### **Monolith (Old Way)**
```
┌─────────────────────────────┐
│   One Big Application       │
│                             │
│  • Users                    │
│  • Rides                    │
│  • Payments                 │
│  • Notifications            │
│                             │
│  One Database               │
└─────────────────────────────┘
```
❌ 1 service crash → toàn bộ app down  
❌ Scale khó (phải scale toàn bộ)  
❌ Deploy chậm (rebuild toàn bộ)

### **Microservices (Modern Way)**
```
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ User   │ │ Ride   │ │Payment │ │ Notify │
│Service │ │Service │ │Service │ │Service │
└────────┘ └────────┘ └────────┘ └────────┘
```
✅ 1 service crash → các service khác vẫn chạy  
✅ Scale độc lập (chỉ scale Ride Service khi cần)  
✅ Deploy nhanh (chỉ deploy service thay đổi)  
✅ Tech stack linh hoạt (Ride dùng Node, Payment dùng Java)

---

## **💡 Next Steps**

Bây giờ bạn đã có **Notification Service**, bạn có thể:

1. **Build thêm services khác:**
   - Ride Service (quản lý chuyến đi)
   - User Service (authentication)
   - Payment Service (xử lý thanh toán)

2. **Build API Gateway:**
   - Tổng hợp tất cả services
   - Expose REST APIs cho mobile
   - WebSocket cho real-time

3. **Build Mobile App:**
   - React Native / Flutter
   - Kết nối API Gateway
   - Hiển thị notifications

---

**Bạn đã hiểu chưa? Có câu hỏi gì về kiến trúc không?** 🎯
