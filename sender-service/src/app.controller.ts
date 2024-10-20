import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateOrderDto } from './dto/create-order';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/send')
  async sendMessage() {
    await this.appService.sendMessage('Hello from sender-service!');
    return 'Message sent to receiver-service';
  }

  @Post('/order')
  async createOrder(@Body() body: CreateOrderDto) {
    await this.appService.createOrderMessage(body);
  }

  @MessagePattern({ cmd: 'competed_order_message' })
  handleCompletedMessage(message: string) {
    this.appService.processHandleCompletedMessage(message);
  }

  @MessagePattern({ cmd: 'failed_order_message' })
  handleFailedMessage(message: string) {
    this.appService.processHandleFailedMessage(message);
  }
}
