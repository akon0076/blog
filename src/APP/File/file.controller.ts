import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  Query,
  Post,
  Res,
  Put,
  Body,
  UsePipes,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { FileService } from './file.service';
import { commonApi } from '../../type';
import { deepGetFileInfo, fileToPdf } from '../../tool/fsTools';
import { booleanMap } from '../../common';
import * as fs from 'fs';
import { exec } from 'child_process';
import {
  AllFileInfoDTO,
  PreviewDTO,
  RemoveDirInputDTO,
  RemoveDirOutputDTO,
  BasicInfoDTO,
  OperationFileDTO,
  AddDirectoryInputDTO,
  AddDirectoryOutputDTO,
  AddDirectoryMapInputDTO,
} from './DTO';

const testPath = '/Users/cvte-redlee/Desktop/我的文档';
// return await fs.readFileSync('/Users/cvte-redlee/Desktop/我的文档/个人文件夹/CVTE心愿清单.pdf')

@Controller('file')
export class FileController {
  constructor(private readonly appService: FileService) {}

  /**
   * 获取目录下的文件信息
   * @param isDeep 是否深度查找
   */
  @Get('getAllFileInfo')
  // @UsePipes(new ValidationPipe())
  async getAllFileInfo(@Query() query: AllFileInfoDTO) {
    const { isDeep, path = testPath, fileType = 'all' } = query;
    const fileList = await deepGetFileInfo({
      filePath: path,
      isDeep: booleanMap[isDeep],
      fileType,
    });
    return {
      success: true,
      data: {
        fileList,
      },
      msg: '',
    };
  }

  /**
   * 获取文件的文件流
   * @param path 需要预览的文件路径
   */
  @Get('preview')
  async preview(
    @Res() response: Response,
    @Query()
    query: PreviewDTO,
  ): Promise<any> {
    const { path } = query;
    const type = path.split('.')[1];

    let resFilePath = path;
    /** word和表格转pdf再返回 */
    if (['docx', 'doc', 'xls', 'xlsx', 'ppt', 'pptx'].includes(type)) {
      /** 从url中提取出文件的名字 */
      const fileName =
        path.split('/')?.slice(-1)?.[0]?.split('.')?.[0] || 'temp';
      resFilePath = `${__dirname}/${fileName}.pdf`;
      await fileToPdf({
        inputPath: path,
        outputPath: resFilePath,
        callBack: (err) => {
          !err && response.sendFile(resFilePath);
        },
      });
    } else {
      /**发送文件流 */
      response.sendFile(resFilePath);
    }
  }

  /**
   * 新增文件夹
   */
  @Post('addDirectory')
  addDirectory(@Body() body: AddDirectoryInputDTO): AddDirectoryOutputDTO {
    console.log('body', body);
    const { path } = body;
    console.log('log:: path', path);
    try {
      fs.mkdirSync(path);
    } catch (err) {
      return new AddDirectoryOutputDTO({
        success: false,
        data: {
          path: '',
        },
        msg: '创建文件夹失败',
      });
    }
    return new AddDirectoryOutputDTO({
      success: true,
      data: {
        path,
      },
    });
  }

  /**
   * 删除文件夹、文件
   * @param path 需要删除的路径
   * @param forceRemove 是否强制删除
   */
  @Delete('removeFileOrDir')
  async removeFileOrDir(
    @Query() query: RemoveDirInputDTO,
  ): Promise<RemoveDirOutputDTO> {
    const { path, forceRemove = '0' } = query;
    const _forceRemove = booleanMap[forceRemove];
    const clearPath = path?.split('?')?.[0];
    if (_forceRemove) {
      try {
        /** 创建子进程执行删除 */
        const removeRes = await new Promise((rs, rj) => {
          const workerProcess = exec(
            `rm -rf ${clearPath}`,
            (error, stdout, stderr) => {
              if (error) {
                console.log(error);
              }
              console.log('stdout: ' + stdout);
              console.log('stderr: ' + stderr);
            },
          );

          workerProcess.on('exit', function (code) {
            console.log('子进程已退出，退出码 ' + code);
            if (code === 0) {
              rs(true);
            } else {
              rj(false);
            }
          });
        });
        console.log('log:: removeRes', removeRes);
      } catch (err) {
        console.log('log:: err', err);
        return new RemoveDirOutputDTO({
          success: false,
          data: {},
          msg: '删除失败',
        });
      }
    } else {
      const dirFileList = await deepGetFileInfo({
        filePath: clearPath,
        isDeep: false,
      });
      if (dirFileList.length === 0) {
        try {
          fs.rmdirSync(clearPath);
        } catch (err) {
          return new RemoveDirOutputDTO({
            success: false,
            msg: '删除失败',
          });
        }
      } else {
        return new RemoveDirOutputDTO({
          success: false,
          data: {
            hasChildren: true,
            dirFileList,
          },
          msg: '目录中存在文件(可能为隐藏文件)',
        });
      }
    }
    return new RemoveDirOutputDTO({ success: true });
  }

  /**
   * 新增文件夹路径
   * @param
   */
  @Post('addDirectoryMap')
  async addDirectoryMap(
    @Body() body: AddDirectoryMapInputDTO,
  ): Promise<BasicInfoDTO<any>> {
    const { path, filename } = body;
    const formatPath = __dirname.replace(/\\/g, '/');
    const configPath = `${formatPath}/directoryMap.txt`;
    const exist = await fs.existsSync(configPath);
    if (exist) {
      const config = fs.readFileSync(configPath, 'utf-8');
      const conifgObj = JSON.parse(config);
      conifgObj.push({ path, filename });
      console.log('conifgObj', conifgObj);
      fs.writeFileSync(
        `${formatPath}/directoryMap.txt`,
        JSON.stringify(conifgObj),
      );
      return new BasicInfoDTO({ success: true, data: conifgObj });
    } else {
      fs.writeFileSync(
        `${formatPath}/directoryMap.txt`,
        JSON.stringify([{ path, filename }]),
      );
      return new BasicInfoDTO({ success: true, data: [{ path, filename }] });
    }
  }

  /**
   * 获取文件夹路径
   * @param
   */
  @Get('getDirectoryMap')
  async getDirectoryMap(): Promise<BasicInfoDTO<any>> {
    const formatPath = __dirname.replace(/\\/g, '/');
    const configPath = `${formatPath}/directoryMap.txt`;
    const exist = await fs.existsSync(configPath);
    if (exist) {
      const config = fs.readFileSync(configPath, 'utf-8');
      const conifList = JSON.parse(config);
      return new BasicInfoDTO({ success: true, data: conifList });
    }

    return new BasicInfoDTO({ success: true, data: [] });
  }

  /**
   * 删除文件夹路径
   * @param
   */
  @Delete('deleteDirectoryMap')
  async deleteDirectoryMap(
    @Query() query: OperationFileDTO,
  ): Promise<BasicInfoDTO<string[]>> {
    const { path } = query;
    const formatPath = __dirname.replace(/\\/g, '/');
    const configPath = `${formatPath}/directoryMap.txt`;
    const exist = await fs.existsSync(configPath);
    if (exist) {
      try {
        const config = fs.readFileSync(configPath, 'utf-8');
        const conifList = JSON.parse(config);
        const _configList = conifList.filter((config) => config.path !== path);
        fs.writeFileSync(
          `${formatPath}/directoryMap.txt`,
          JSON.stringify(_configList),
        );
        return new BasicInfoDTO({ success: true, data: _configList });
      } catch (e) {
        return new BasicInfoDTO({ success: false, data: e });
      }
    } else {
      return new BasicInfoDTO({ success: false, data: [], msg: '暂无配置' });
    }
  }
}
