import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['172.26.63.222:9092'],
        },
        consumer: {
          groupId: "notification-group",
        },
      },
    },
  );

  await app.listen();
  console.log("🚀 Notification Service is listening for Kafka events...");
}

bootstrap();
