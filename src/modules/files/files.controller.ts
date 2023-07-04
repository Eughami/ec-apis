import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { Response } from 'express';
import { FileParams } from 'src/interfaces/files.dto';
import { join } from 'path';
import fs from 'fs';
@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(public readonly service: FilesService) {}
  @Get(':type/:category/:name')
  async serveImage(
    @Param() params: FileParams,
    @Res() res: Response,
  ): Promise<void> {
    const filePath = `${params.type}/${params.category}/${params.name}`;
    this.service.serveImage(filePath, res);
  }
  @Get('hdt/:path')
  async serveHDT(
    @Res() res: Response,
    @Param('path') path: string,
  ): Promise<void> {
    res.set('Cache-Control', 'public, max-age=31557600'); // Cache for 1 year
    res.type('image/jpeg');

    const rootPath = process.cwd();
    const appPath = join(rootPath, 'files/hdt', path);

    const fileStream = fs.createReadStream(appPath);
    // Handling error event
    fileStream.on('error', (err) => {
      res.removeHeader('Cache-Control');
      res.setHeader('content-type', 'text/plain');
      res.status(400).send('Could not process your file');
    });
    fileStream.pipe(res);
  }
}
