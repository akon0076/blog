import React, { FC } from 'react';
import style from './index.less';
import { Button } from 'antd';

interface IProps {
  onClick: () => void;
}
const mdHeader: FC<IProps> = props => {
  const { onClick } = props;
  return <div className={style.title}>
    <span >Markdown</span>
    <span className={style.tool}>
      <Button onClick={onClick} size="small" type="primary">保存</Button>
    </span>
  </div>
}

export default mdHeader;