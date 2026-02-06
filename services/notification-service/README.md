# Notification Service - Cab Booking System

A microservice built with **NestJS**, **Kafka**, and **MongoDB** to handle real-time notifications for a cab booking platform.

---

## **📋 Prerequisites**

Before running this project, ensure you have:

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **Docker** and **Docker Compose** ([Docker Desktop](https://www.docker.com/products/docker-desktop/) or Docker Engine)
- **Git** ([Download](https://git-scm.com/))

---

## **🚀 Quick Start**

### **1. Clone the Repository**

```bash
git clone <your-repo-url>
cd notification-service
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Configure Environment**

**⚠️ IMPORTANT:** Update the IP addresses in these files based on your setup:

**If using Docker Desktop on Windows/Mac:**
- Keep `localhost` in all files (default works)

**If using WSL/Linux:**
- Get your WSL IP: `hostname -I | awk '{print $1}'`
- Update the IP in:
  - `docker-compose.yml` (line 23): `KAFKA_ADVERTISED_LISTENERS`
  - `src/main.ts` (line 9): `brokers` array
  - `src/app.module.ts` (line 12): MongoDB URI
  - `scripts/trigger-event.ts` (line 5): `brokers` array

### **4. Start Infrastructure**

**Using Docker Compose:**

```bash
# Start Kafka, Zookeeper, and MongoDB
docker compose up -d

# Verify all containers are running
docker ps
```

You should see 3 containers: `kafka`, `zookeeper`, `mongo`

**Wait 10-15 seconds for Kafka to fully initialize.**

### **5. Build the Project**

```bash
npm run build
```

### **6. Run the Application**

```bash
npm run start:dev
```

You should see:
```
🚀 Notification Service is listening for Kafka events...
```

---

## **🧪 Testing**

### **Run Unit Tests**

```bash
npm test
```

### **Send Test Events**

**Option 1: TypeScript Script (Recommended)**

```bash
npx ts-node scripts/trigger-event.ts
```

**Option 2: PowerShell Script**

```powershell
.\scripts\send-test-events.ps1
```

**Option 3: Bash Script (WSL/Linux)**

```bash
bash scripts/send-kafka-events.sh
```

### **Expected Output**

In the app terminal, you'll see:

```
📩 Received event: ride.assigned
Payload: { customerId: '123', driverName: 'Test Driver' }
💾 Notification saved to database
📧 Simulating notification delivery...
   To: 123
   Title: Ride Assigned
   Message: Your ride has been assigned to driver Test Driver
-----------------------------------
✅ Notification sent to Customer: 123
```

---

## **📂 Project Structure**

```
notification-service/
├── src/
│   ├── schemas/
│   │   └── notification.schema.ts   # Mongoose schema
│   ├── app.module.ts                 # Root module
│   ├── app.controller.ts             # Kafka event handlers
│   ├── app.service.ts                # Business logic
│   └── main.ts                       # App bootstrap
├── scripts/
│   ├── trigger-event.ts              # Test event sender
│   ├── send-test-events.ps1          # PowerShell script
│   └── send-kafka-events.sh          # Bash script
├── docker-compose.yml                # Infrastructure setup
├── .env                              # Environment variables
└── package.json
```

---

## **🎯 Kafka Topics**

### **1. `ride.assigned`**
**Payload:**
```json
{
  "customerId": "string",
  "driverName": "string"
}
```
**Action:** Sends notification to customer about assigned driver

### **2. `payment.completed`**
**Payload:**
```json
{
  "driverId": "string",
  "amount": number
}
```
**Action:** Sends payment confirmation to driver

---

## **🗄️ Database Schema**

**MongoDB Collection:** `notifications`

```typescript
{
  userId: string,      // Recipient ID
  title: string,       // Notification title
  message: string,     // Notification content
  type: string,        // Event type (e.g., "ride.assigned")
  createdAt: Date      // Timestamp
}
```

---

## **🔧 Troubleshooting**

### **Issue: Connection Refused (ECONNREFUSED)**

**Cause:** Docker containers not running or wrong IP

**Fix:**
1. Check containers: `docker ps`
2. Restart: `docker compose down && docker compose up -d`
3. Update IP addresses (see step 3 in Quick Start)

### **Issue: Kafka not starting**

**Cause:** Kafka needs time to initialize

**Fix:**
1. Check logs: `docker logs kafka`
2. Wait 10-15 seconds after `docker compose up -d`
3. Look for: `[KafkaServer id=1] started`

### **Issue: Tests failing**

**Fix:**
```bash
npm install --save-dev jest @types/jest ts-jest
npm test
```

---

## **🛠️ Available Scripts**

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run build` | Build the project |
| `npm run start` | Start in production mode |
| `npm run start:dev` | Start in development mode (watch) |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:cov` | Run tests with coverage |

---

## **🌐 Environment Variables**

Create a `.env` file (already included):

```env
MONGODB_URI=mongodb://localhost:27017/notification-db
KAFKA_BROKER=localhost:9092
KAFKA_CONSUMER_GROUP=notification-group
```

**Note:** Update IPs if using WSL (see Quick Start step 3)

---

## **📦 Production Deployment**

### **Build for Production**

```bash
npm run build
npm run start:prod
```

### **Docker Production Setup**

For production, consider:
- Running app in Docker container
- Using managed Kafka (Confluent Cloud, AWS MSK)
- Using managed MongoDB (MongoDB Atlas)
- Adding health checks and monitoring

---

## **🤝 Contributing**

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## **📄 License**

MIT License - feel free to use for learning and commercial projects.

---

## **👨‍💻 Author**

Built as a learning project for NestJS + Kafka + MongoDB integration.

---

## **🎓 Learning Resources**

- [NestJS Documentation](https://docs.nestjs.com/)
- [Kafka Documentation](https://kafka.apache.org/documentation/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [KafkaJS Library](https://kafka.js.org/)

---

## **📞 Support**

If you encounter issues:
1. Check the Troubleshooting section
2. Review Docker logs: `docker logs kafka`, `docker logs mongo`
3. Open an issue on GitHub
