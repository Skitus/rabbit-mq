import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

class BaseDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class CreateOrderDto extends BaseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  count: number;
}
