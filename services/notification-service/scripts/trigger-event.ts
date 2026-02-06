import { Kafka } from 'kafkajs';

async function sendTestEvent() {
  const kafka = new Kafka({
    clientId: 'test-producer',
    brokers: ['172.26.63.222:9092'],
  });

  const producer = kafka.producer();

  try {
    await producer.connect();
    console.log('✅ Connected to Kafka');

    // Send ride.assigned event
    await producer.send({
      topic: 'ride.assigned',
      messages: [
        {
          value: JSON.stringify({
            customerId: '123',
            driverName: 'Test Driver',
          }),
        },
      ],
    });
    console.log('📤 Sent event to topic: ride.assigned');

    // Wait a bit
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Send payment.completed event
    await producer.send({
      topic: 'payment.completed',
      messages: [
        {
          value: JSON.stringify({
            driverId: 'driver-789',
            amount: 45.99,
          }),
        },
      ],
    });
    console.log('📤 Sent event to topic: payment.completed');

    await producer.disconnect();
    console.log('✅ Test events sent successfully!');
    console.log('\n👀 Check the main app terminal for received events.');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

sendTestEvent();
