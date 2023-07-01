import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { Response } from 'express';
import { FileParams } from 'src/interfaces/files.dto';

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
}
