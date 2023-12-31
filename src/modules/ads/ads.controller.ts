import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { crudGeneralOptions } from 'src/core-configs/crud.config';
import { Ad } from 'src/entities/Ad.entity';
import { AdsService } from './ads.service';
import { FilePayload, NewAdPayload } from 'src/interfaces/ad.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Log } from 'src/entities/Log.entity';
@Crud({
  ...crudGeneralOptions,
  model: {
    type: Ad,
  },
  routes: {
    only: [
      'getManyBase',
      'getOneBase',
      'createOneBase',
      'updateOneBase',
      'deleteOneBase',
    ],
  },
  query: {
    ...crudGeneralOptions.query,
    join: {
      category: { eager: true, allow: ['name'] },
      attachment: { eager: false, allow: ['path', 'position'] },
      device: { eager: false, allow: ['id'] },
      views: { eager: false },
      user: { eager: false },
    },
  },
})
@ApiTags('Auth')
@Controller('ads')
export class AdsController implements CrudController<Ad> {
  constructor(public readonly service: AdsService) {}

  @Override('createOneBase')
  @UseInterceptors(
    FilesInterceptor('files', 4, {
      limits: {
        files: 4,
        // parts: 11,
        fileSize: 25 * 1024 * 1024,
      },
    }),
  )
  createOne(
    @UploadedFiles() files: FilePayload[],
    @Body() dto: NewAdPayload,
  ): Promise<Ad> {
    return this.service.createAd(dto, files);
  }

  @Post('startup')
  startup(@Body() body: Partial<Log>) {
    return this.service.startup(body);
  }

  @Get('trending')
  trending() {
    return this.service.trending();
  }

  @Override('getOneBase')
  getOneBase(
    @ParsedRequest() req: CrudRequest,
  ): Promise<Ad & { count: number }> {
    return this.service.getOne(req);
  }
  //
  // TODO.Add an endpoint to get the top viewed ads for last week/month
  // TODO.Add relation between ad -> device  and also adView -> device
  // TODO.Add an additional payload for the get one (last week,last month, total views)
}
