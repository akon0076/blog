import { IsNotEmpty } from 'class-validator';
import { OperationFileDTO } from '../../OperationFileDTO';

export class RemoveDirInputDTO extends OperationFileDTO {
  forceRemove?: '0' | '1' = '0';
}
