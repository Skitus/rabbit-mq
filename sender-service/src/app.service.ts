import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order';

@Injectable()
export class AppService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@localhost:5672'],
        queue: 'receiver_queue',
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  // Метод отправки сообщения
  async sendMessage(message: string) {
    return this.client.emit({ cmd: 'process_message' }, message);
  }

  async createOrderMessage(body: CreateOrderDto) {
    return this.client.emit({ cmd: 'create_order_message' }, body);
  }

  processHandleCompletedMessage(message: string) {
    console.log('message from completed', message);
    return message;
  }

  processHandleFailedMessage(message: string) {
    console.log('message from failed', message);
    return message;
  }
}
