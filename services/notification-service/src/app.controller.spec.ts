import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            sendNotification: jest.fn().mockResolvedValue({
              userId: 'test-user',
              title: 'Test',
              message: 'Test message',
              type: 'test.event',
              createdAt: new Date(),
            }),
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  describe('handleRideAssigned', () => {
    it('should handle ride.assigned event and send notification', async () => {
      const payload = { customerId: 'customer123', driverName: 'John Doe' };
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await appController.handleRideAssigned(payload);

      expect(appService.sendNotification).toHaveBeenCalledWith({
        userId: 'customer123',
        title: 'Ride Assigned',
        message: 'Your ride has been assigned to driver John Doe',
        type: 'ride.assigned',
      });

      expect(consoleSpy).toHaveBeenCalledWith('📩 Received event: ride.assigned');
      consoleSpy.mockRestore();
    });
  });

  describe('handlePaymentCompleted', () => {
    it('should handle payment.completed event and send notification', async () => {
      const payload = { driverId: 'driver456', amount: 25.5 };
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await appController.handlePaymentCompleted(payload);

      expect(appService.sendNotification).toHaveBeenCalledWith({
        userId: 'driver456',
        title: 'Payment Received',
        message: 'You have received a payment of $25.5',
        type: 'payment.completed',
      });

      expect(consoleSpy).toHaveBeenCalledWith('📩 Received event: payment.completed');
      consoleSpy.mockRestore();
    });
  });
});
