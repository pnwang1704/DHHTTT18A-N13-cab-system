import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern("ride.assigned")
  async handleRideAssigned(
    @Payload() data: { customerId: string; driverName: string },
  ) {
    console.log("📩 Received event: ride.assigned");
    console.log("Payload:", data);

    await this.appService.sendNotification({
      userId: data.customerId,
      title: "Ride Assigned",
      message: `Your ride has been assigned to driver ${data.driverName}`,
      type: "ride.assigned",
    });

    console.log(`✅ Notification sent to Customer: ${data.customerId}`);
  }

  @EventPattern("payment.completed")
  async handlePaymentCompleted(
    @Payload() data: { driverId: string; amount: number },
  ) {
    console.log("📩 Received event: payment.completed");
    console.log("Payload:", data);

    await this.appService.sendNotification({
      userId: data.driverId,
      title: "Payment Received",
      message: `You have received a payment of $${data.amount}`,
      type: "payment.completed",
    });

    console.log(`✅ Notification sent to Driver: ${data.driverId}`);
  }
}
