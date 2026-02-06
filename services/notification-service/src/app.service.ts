import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  Notification,
  NotificationDocument,
} from "./schemas/notification.schema";

interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  type: string;
}

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async sendNotification(payload: NotificationPayload): Promise<Notification> {
    // Save notification to MongoDB
    const notification = new this.notificationModel({
      userId: payload.userId,
      title: payload.title,
      message: payload.message,
      type: payload.type,
      createdAt: new Date(),
    });

    const savedNotification = await notification.save();

    // Simulate sending notification
    console.log("💾 Notification saved to database");
    console.log("📧 Simulating notification delivery...");
    console.log(`   To: ${payload.userId}`);
    console.log(`   Title: ${payload.title}`);
    console.log(`   Message: ${payload.message}`);
    console.log("-----------------------------------");

    return savedNotification;
  }
}
