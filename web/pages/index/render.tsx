import React, { useContext } from 'react'
import { SProps, IContext } from 'ssr-types-react';
import '@/common.less';

export default (props: SProps) => {
  return (
    <div>
      <span onClick={() => {
        props.history.push('/detail/cbba934b14f747049187')
      }}>toDetail</span>
    </div>
  )
}
