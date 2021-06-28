import { BasicInfoDTO } from '../../BasicInfoDTO';
import { commonApi } from '../../../../../type';
type dataProps = {
  hasChildren?: boolean;
  dirFileList?: any[]; // 文件信息
};
export class RemoveDirOutputDTO extends BasicInfoDTO<dataProps> {
  constructor(params: commonApi<dataProps>) {
    super(params);
  }
}
