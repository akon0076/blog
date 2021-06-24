import * as fs from 'fs';
import { join } from 'path';
const libre = require('libreoffice-convert-win');

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
export const deepGetFileInfo = async (params: {
  filePath: string;
  isDeep?: boolean;
  fileType?: 'file' | 'directory' | 'all';
}) => {
  const { filePath, isDeep = false, fileType = 'all' } = params;
  const fileDisplay = async (filePath) => {
    const _fileInfo = [];
    const _directoryInfo = [];
    try {
      let fileList = await fs.readdirSync(filePath);
      //根据文件路径读取文件，返回文件列表
      fileList = fileList.filter((item) => !/(^|\/)\.[^\/\.]/g.test(item));
      for (const filename of fileList) {
        const filedir = join(filePath, filename);
        try {
          //根据文件路径获取文件信息，返回一个fs.Stats对象
          const stats = fs.statSync(filedir);
          if (stats.isFile() && ['all', 'file'].includes(fileType)) {
            _fileInfo.push({ ...stats, filePath: filedir, filename });
          }
          if (stats.isDirectory() && ['all', 'directory'].includes(fileType)) {
            const info = {
              ...stats,
              filename,
              filePath: filedir,
            }; //递归，如果是文件夹，就继续遍历该文件夹下面的文件
            if (isDeep) {
              const _deepFileInfo = await fileDisplay(filedir);
              Object.assign(info, { children: _deepFileInfo });
            }
            _directoryInfo.push(info);
          }
        } catch (error) {
          console.log('statSync error', error);
        }
      }
    } catch (error) {
      console.log('readdirSync error', error);
    }
    if (fileType === 'all') {
      return [].concat(_directoryInfo, _fileInfo);
    }
    if (fileType === 'directory') {
      return _directoryInfo;
    }
    return _fileInfo;
  };
  return await fileDisplay(filePath);
};

/**
 * 转换word为PDF
 * @param inputPath 文件读取路径
 * @param outputPath 文件输出路径
 * @param clearValueAfterCb 执行回调后是否清除文件，默认清除
 * @param callBack 生成文件后的回调
 */

export const fileToPdf = async (params: {
  inputPath: string;
  outputPath: string;
  clearValueAfterCb?: boolean;
  callBack?: (err?: any) => void;
}) => {
  const { inputPath, outputPath, callBack, clearValueAfterCb = true } = params;
  const file = fs.readFileSync(inputPath);

  // Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
  const fileRes = await libre.convert(
    file,
    '.pdf',
    undefined,
    async (err, done) => {
      if (err) {
        callBack?.(err);
        console.log('请检查是否有安装LibreOffice');
        console.log(`Error converting file: ${err}`);
      }
      try {
        /** 将pdf写入到磁盘 */
        await fs.writeFileSync(outputPath, done);
        /** 执行外部回调，一般是获取输出的pdf文件*/
        callBack?.(null);
        /** 删除pdf文件 */
        clearValueAfterCb && fs.rmSync(outputPath);
      } catch (err) {
        callBack?.(err);
      }
    },
  );
  console.log('log:: fileRes', fileRes);
};
