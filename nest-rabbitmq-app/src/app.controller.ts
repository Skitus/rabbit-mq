import { Controller, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/send')
  async sendMessage(): Promise<string> {
    await this.appService.sendMessage('Hello RabbitMQ!');
    return 'Message sent to RabbitMQ';
  }

  @MessagePattern({ cmd: 'message' })
  handleMessage(message: string): void {
    console.log(`Received message: ${message}`);
  }
}
