import React, { useContext } from 'react';
import '@/common.less';
import { IContext, SProps } from 'ssr-types-react';

export default (props: SProps) => {
  // const { state, dispatch } = useContext<IContext<Ddata>>(window.STORE_CONTEXT)
  return (
    <div>
      <span>detail</span>
    </div>
  )
}
