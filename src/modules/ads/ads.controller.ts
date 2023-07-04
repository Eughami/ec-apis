import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';
import { crudGeneralOptions } from 'src/core-configs/crud.config';
import { Ad } from 'src/entities/Ad.entity';
import { AdsService } from './ads.service';
import { FilePayload, NewAdPayload } from 'src/interfaces/ad.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Device } from 'src/entities/Device.entity';
import { Log } from 'src/entities/Log.entity';
@Crud({
  ...crudGeneralOptions,
  model: {
    type: Ad,
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'createOneBase', 'updateOneBase'],
  },
  query: {
    ...crudGeneralOptions.query,
    join: {
      category: { eager: true, allow: ['name'] },
      attachment: { eager: false, allow: ['path', 'position'] },
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

  @Post('device')
  newDevice(@Body() dto: Partial<Device>) {
    return this.service.newDevice(dto);
  }

  @Post('startup')
  startup(@Body() body: Partial<Log>) {
    this.service.startup(body);
  }
  // TODO.Add an endpoint to get the top viewed ads for last week/month
  // TODO.Add relation between ad -> device  and also adView -> device
  // TODO.Add an additional payload for the get one (last week,last month, total views)
}
