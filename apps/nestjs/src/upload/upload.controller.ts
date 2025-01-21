import path from 'node:path';
import {
  Controller,
  Get,
  Header,
  Options,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import fse from 'fs-extra';
import { Express } from 'express';
import { UserService } from './upload.service';

import { STATIC_PATH } from '@/constant/config';

const getChunkDir = (fileHash) => {
  // 添加 chunkCache 前缀与文件名做区分
  // target/chunkCache_fileHash值
  return path.resolve(STATIC_PATH, `chunkCache_${fileHash}`);
};

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('upload')
  // CORS Headers
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Headers', '*')
  @Header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  // file upload
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
    @Res() res,
  ) {
    const { fileHash, chunkIndex } = req.body;
    const chunkDir = getChunkDir(fileHash);
    // 判断文件夹是否存在，不存在则创建
    if (!fse.existsSync(chunkDir)) {
      await fse.mkdirs(chunkDir);
    }
  }

  @Post('merge')
  // CORS Headers
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Headers', '*')
  @Header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  async merge(@Req() req, @Res() res) {
    const { fileHash, filename } = req.body;
    const chunkDir = getChunkDir(fileHash);
    const targetDir = path.resolve(STATIC_PATH, filename);
    // await this.userService.mergeFile(chunkDir, targetDir);
  }

  @Options('upload|merge|verify')
  // CORS Headers
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Headers', '*')
  @Header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  async uploadOptions(@Req() req, @Res() res) {
    return res.status(200).send();
  }
}
