import { commonApi } from '../../../../type';

export class BasicInfoDTO<T> {
  constructor(params: commonApi<T>) {
    Object.assign(this, params);
  }
  data: T = {} as T;
}
