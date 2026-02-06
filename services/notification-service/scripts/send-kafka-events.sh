#!/bin/bash

# Script to send test events to Kafka topics
# Run this in WSL terminal

KAFKA_BROKER="172.26.63.222:9092"
KAFKA_CONTAINER="kafka"

echo "🚀 Sending test events to Kafka..."

# Send ride.assigned event
echo '{"customerId":"customer-456","driverName":"John Smith"}' | \
sudo docker exec -i $KAFKA_CONTAINER kafka-console-producer \
  --broker-list localhost:9092 \
  --topic ride.assigned

echo "✅ Sent: ride.assigned event"

# Wait a moment
sleep 2

# Send payment.completed event
echo '{"driverId":"driver-123","amount":99.99}' | \
sudo docker exec -i $KAFKA_CONTAINER kafka-console-producer \
  --broker-list localhost:9092 \
  --topic payment.completed

echo "✅ Sent: payment.completed event"
echo "👀 Check the app terminal for received events!"
