import { IsNotEmpty } from 'class-validator';

export class UserCreatInputDTO {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  age: number;
}
