import { IsNotEmpty } from 'class-validator';
import { OperationFileDTO } from '../OperationFileDTO';

export class AllFileInfoDTO extends OperationFileDTO {
  isDeep: '0' | '1' = '0';
  fileType: 'file' | 'directory' | 'all';
}
