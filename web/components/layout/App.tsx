// 此文件将会在服务端/客户端都将会用到
// 可通过 __isBrowser__ 或者 useEffect 判断当前在 浏览器环境做一些初始化操作

import { LayoutProps } from 'ssr-types-react';
import { IContext, SProps } from 'ssr-types-react'
import { useEffect, useContext, useState, useCallback, useRef } from 'react';
import { Ddata, globalProps } from '@/interface';

const App = (props: LayoutProps) => {
  const { children } = props;
  const { dispatch } = useContext<IContext<globalProps>>(window.STORE_CONTEXT);

  /** 模式切换 */
  const setSystemTheme = useCallback((params: { matches: boolean }) => {
    const { matches } = params;
    dispatch?.({ type: 'updateContext', payload: { systemTheme: matches ? 'dark' : 'white' } });
  }, []);

  /** 全局事件处理 */
  useEffect(() => {
    setSystemTheme({ matches: window.matchMedia('(prefers-color-scheme: dark)').matches });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      setSystemTheme({ matches: e.matches })
    })
  }, []);
  return children!;
}

export default App;