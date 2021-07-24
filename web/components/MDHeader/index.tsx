import React, { FC, useCallback, useState } from 'react';
import style from './index.less';
import { Button, Input } from 'antd';

interface IProps {
  onClick: () => void;
}
const mdHeader: FC<IProps> = props => {
  const { onClick } = props;
  const [title, setTitle] = useState('Markdown');
  const onChange = useCallback((e) => {
    setTitle(e.target.value);
  }, []);

  return <div className={style.title}>
    <div>
      <Input
        value={title}
        placeholder="请键入标题"
        onChange={onChange}
      />
    </div>
    <div className={style.tool}>
      <Button onClick={onClick} size="small" type="primary">保存</Button>
    </div>
  </div>
}

export default mdHeader;