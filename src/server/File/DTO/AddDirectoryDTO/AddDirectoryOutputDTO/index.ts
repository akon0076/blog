import { commonApi } from '../../../../../type';
import { BasicInfoDTO } from '../../BasicInfoDTO';
type dataProps = {
  path?: string;
};
export class AddDirectoryOutputDTO extends BasicInfoDTO<dataProps> {
  constructor(params: commonApi<dataProps>) {
    super(params);
  }
}
