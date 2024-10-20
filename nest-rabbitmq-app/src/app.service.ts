import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class AppService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@localhost:5672'],
        queue: 'main_queue',
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  // Отправка сообщения
  async sendMessage(message: string) {
    return this.client.send({ cmd: 'message' }, message).toPromise();
  }
}
