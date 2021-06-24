import { OperationFileDTO } from '../OperationFileDTO';
import { IsNotEmpty } from 'class-validator';

export class AddDirectoryMapInputDTO extends OperationFileDTO {
    @IsNotEmpty()
    filename: string;
}