import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Tree, Input } from 'antd';
import {
  FolderAddFilled,
  FileAddFilled,
  DeleteFilled
} from '@ant-design/icons'
import style from './index.less';
import { http } from '../../http'
import { getUUId } from '../../../src/utils/tool';
import { cloneDeep } from 'lodash';
interface IProps {
  fileList: any[];
}
const pageList: FC<IProps> = props => {
  const { fileList } = props;
  const [onEditKey, setOnEditKey] = useState('');
  const [onEditValue, setOnEditValue] = useState('');
  const [onEditFileType, setOnEditFileType] = useState('');
  const [list, setList] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);
  const [fileMap, setFileMap] = useState<any>({});

  useEffect(() => {
    getPage({ fileList });
  }, [fileList]);

  /** 获取所有的文章 */
  const getPage = useCallback(async ({ fileList }) => {
    const _data: any = constractFile(cloneDeep(fileList));
    setList(_data);
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
    isNew: boolean;
    title: string;
    parentId: string;
  }) => {
    const { id: nodeId, type, title, parentId, isNew } = params;
    const { success, data } = await http({
      method: 'put',
      api: '/file',
      data: {
        id: isNew ? undefined : nodeId,
        type,
        name: title,
        parentId
      }
    });
    setOnEditKey('');
    console.log('success', success);
    if (success) {
      const [{ id, parentId, name }] = data;
      console.log('e', fileMap, parentId, data)
      fileMap[parentId].children = [
        ...(fileMap[parentId].children || []).filter((node: any) => node.id !== nodeId),
        {
          ...data,
          key: id,
          title: name
        }]
      fileMap[nodeId] = undefined;
      fileMap[id] = data;
      setFileMap({ ...fileMap });
      setList(list.slice());
      console.log('list', JSON.parse(JSON.stringify(list)))
      console.log('data', data, fileMap)
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
    type: 'directory' | 'file'
  }) => {
    const { node, type } = params;
    const newId = getUUId();
    const defultTitle = '新建文件夹';
    setOnEditKey(newId);
    setOnEditFileType(type);
    setOnEditValue(defultTitle);
    setFileMap({ ...fileMap, [newId]: node })
    const newNode = { id: newId, key: newId, title: defultTitle, type, isNew: true };
    node.children = [newNode, ...(node.children || [])];
    setList(list.slice());
    const _expandedKeys = Array.from(new Set([...expandedKeys, node.key]));
    setExpandedKeys(_expandedKeys);
  }, [list, expandedKeys, fileMap]);

  const generateTreeData: any = useCallback((params: {
    list: any[];
    onEditKey: string;
    onEditValue: string;
    parentId: string;
  }) => {
    const { list, onEditKey, onEditValue, parentId } = params;
    return list.map((node: any) => {
      const { children = [], title, key, type, isNew } = node;
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
            parentId,
            isNew
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
                node,
                type
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