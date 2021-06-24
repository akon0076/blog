import { IsNotEmpty } from 'class-validator';

export class OperationFileDTO {
  @IsNotEmpty()
  path: string;
}
