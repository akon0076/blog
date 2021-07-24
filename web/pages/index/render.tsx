import React, { useCallback, useEffect, useRef, useContext, useState, ElementRef } from 'react'
import { SProps, IContext } from 'ssr-types-react';
import MDHeader from '../../components/MDHeader';
import style from './index.less';
import Editor from "rich-markdown-editor";
import { http } from '../../http';
import { globalProps } from '@/interface';
import PageList from '@/components/PageList';

export default (props: SProps) => {
  const divRef = useRef<any>();
  const editerRef = useRef<ElementRef<typeof Editor>>();
  const { state } = useContext<IContext<globalProps>>(window.STORE_CONTEXT);
  const [value, setValue] = useState('Hello world!');
  const [title, setTitle] = useState('MarkDown');
  useEffect(() => {
    divRef.current.addEventListener('paste', function (event: any) {
      const files: any[] = [];
      /** 过滤出所有图片 */
      for (const file of event.clipboardData.files) {
        file.type.includes('image') && files.push(file);
      }
      event.stopPropagation();
    }, true);

  }, []);

  /** 保存 */
  const save = useCallback(async ({ value, title }) => {
    http({
      api: '/page',
      method: 'put',
      data: {
        content: value,
        title
      }
    })
  }, []);

  return (
    <div ref={divRef} className={style.index}>
      <PageList />
      <MDHeader onClick={() => save({ value, title })} />
      <div className={style['editor-wapper']}>
        <Editor
          ref={editerRef as any}
          dark={(state as globalProps).systemTheme === 'dark'}
          onChange={(getvalue) => {
            setValue(getvalue());
          }}
          defaultValue="Hello world!"
        />
      </div>

      {/* <span onClick={() => {
        props.history.push('/detail/cbba934b14f747049187')
      }}>toDetail</span> */}
    </div>
  )
}