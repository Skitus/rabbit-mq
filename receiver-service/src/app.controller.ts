import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { ICreateOrderMessage } from './interface/create-order.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'process_message' })
  handleMessage(message: string) {
    this.appService.processMessage(message);
  }

  @MessagePattern({ cmd: 'create_order_message' })
  handleOrderMessage(message: ICreateOrderMessage) {
    this.appService.processOrderMessage(message);
  }
}
