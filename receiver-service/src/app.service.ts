import { Injectable } from '@nestjs/common';
import { ICreateOrderMessage } from './interface/create-order.interface';
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
        queue: 'order_response_queue',
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  // Метод обработки сообщения
  processMessage(message: string) {
    console.log(`Received message: ${message}`);
  }

  processOrderMessage(message: ICreateOrderMessage) {
    const mockGoods = [
      {
        id: 'blabla123',
        name: 'cucumber',
        count: 4,
      },
      {
        id: 'blabla1234',
        name: 'banana',
        count: 2,
      },
      {
        id: 'blabla12345',
        name: 'meat',
        count: 1,
      },
    ];

    const isGoodsExist = mockGoods.find(
      (item) => item.id === message.id && message.count <= item.count,
    );

    console.log(
      'message from order service',
      message,
      'isGoodsExist',
      isGoodsExist,
    );

    if (isGoodsExist) {
      return this.client.emit(
        { cmd: 'competed_order_message' },
        `Your order is completed: ${isGoodsExist.name}`,
      );
    } else {
      return this.client.emit(
        { cmd: 'failed_order_message' },
        `Your order is failed`,
      );
    }
  }
}
