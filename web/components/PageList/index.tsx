import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Tree, Input } from 'antd';
import {
  FolderAddFilled,
  FileAddFilled,
  DeleteFilled
} from '@ant-design/icons'
import style from './index.less';
import { http } from '../../http'
import { node } from 'prop-types';
import { getUUId } from '../../../src/tool';
interface IProps {

}
const pageList: FC<IProps> = props => {
  const { } = props;
  const [onEditKey, setOnEditKey] = useState('');
  const [onEditValue, setOnEditValue] = useState('');
  const [list, setList] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);
  const [fileMap, setFileMap] = useState({});

  useEffect(() => {
    // saveFile({
    //   type: 'directory',
    //   title: '文件夹'
    // });
    getPage();
  }, []);

  /** 获取所有的文章 */
  const getPage = useCallback(async () => {
    const { success, data } = await http({
      api: '/file',
      method: 'get'
    });
    setExpandedKeys(data.map((item: any) => item.id));
    if (success) {
      const _data: any = constractFile(data);
      setList(_data);
    }
  }, []);


  const onNodeClick = useCallback(({
    key,
    title
  }: {
    key: string,
    title: string
  }) => {
    setOnEditKey(key);
    setOnEditValue(title);
  }, []);

  /** 保存文件目录 */
  const saveFile = useCallback(async (params: {
    id: string;
    type: string;
    title: string;
    parentId: string;
  }) => {
    const { id, type, title, parentId } = params;
    const { success } = await http({
      method: 'put',
      api: '/file',
      data: {
        id,
        type,
        name: title,
        parentId
      }
    });
    setOnEditKey('');
    if (success) {
      fileMap[id].title = title;
      setList(list.slice())
    }
  }, [fileMap, list]);

  /** 构建树形结构 */
  const constractFile = useCallback((list) => {
    const fileMap: any = {};
    list.forEach((item: any) => {
      const { id, name } = item;
      fileMap[id] = Object.assign(item, { key: id, title: name })
    });
    setFileMap(fileMap);
    list.forEach((item: any) => {
      const { parentId } = item;
      parentId && (fileMap[parentId].children = [...fileMap[parentId]?.children || [], item]);
    });

    return list.filter((item: any) => !item.parentId);
  }, [])

  const addDirectory = useCallback((params: {
    parentId: string;
    node: any;
  }) => {
    const { node } = params;
    const newId = getUUId();
    const newNode = { id: newId, key: newId, title: '新建文件夹' };
    node.children = [newNode, ...(node.children || [])];
    setList(list.slice());
    const _expandedKeys = Array.from(new Set([...expandedKeys, node.key]));
    setExpandedKeys(_expandedKeys);
  }, [list, expandedKeys]);

  const generateTreeData: any = useCallback((params: {
    list: any[];
    onEditKey: string;
    onEditValue: string;
    parentId: string;
  }) => {
    const { list, onEditKey, onEditValue, parentId } = params;
    return list.map((node: any) => {
      const { children = [], title, key, type } = node;
      return {
        ...node,
        title: onEditKey === key ? <Input
          value={onEditValue}
          autoFocus={true}
          onBlur={() => setOnEditKey('')}
          onChange={e => setOnEditValue(e.target.value)}
          onPressEnter={() => saveFile({
            id: key,
            type,
            title: onEditValue,
            parentId
          })}
        /> : <div
          className={style['node-title-wrapper']}
          onDoubleClick={() => onNodeClick({ key, title })}
        >
          <div className={style['title']}>
            {title}
          </div>
          <div
            className={style['hide-file-operation']}
          >
            <FolderAddFilled
              className={style['operation-icon']}
              onClick={() => addDirectory({
                parentId: key,
                node
              })}
            />
            <FileAddFilled
              className={style['operation-icon']}
            />
            <DeleteFilled
              className={`${style['operation-icon']} ${style['operation-remove']}`}
            />
          </div>
        </div>,
        children: generateTreeData({ list: children, onEditKey, onEditValue, parentId: key })
      }
    })
  }, [addDirectory, saveFile]);

  /** 展开事件 */
  const onExpand = useCallback((expandedKeys, { expanded: bool, node }) => {
    setExpandedKeys(expandedKeys);
  }, [])

  const treeData = useMemo(() => {
    return generateTreeData({ list, onEditKey, onEditValue })
  }, [list, onEditKey, onEditValue, generateTreeData])
  return <div className={style['tree']}>
    <Tree
      treeData={treeData}
      expandedKeys={expandedKeys}
      onExpand={onExpand}
      blockNode
    />
  </div>
}

export default pageList;