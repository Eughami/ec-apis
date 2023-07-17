import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeviceService } from './device.service';
import { Device } from 'src/entities/Device.entity';
import {
  DeviceAdViewBulkDto,
  DeviceAdViewDto,
  DeviceQueryDto,
  FavCat,
  changeLangDto,
} from 'src/interfaces/device.dto';

@ApiTags('Device')
@Controller('devices')
export class DeviceController {
  constructor(public readonly service: DeviceService) {}

  @Post('')
  newDevice(@Body() dto: Partial<Device>) {
    return this.service.newDevice(dto);
  }

  @Post('fav')
  favCat(@Body() dto: FavCat) {
    return this.service.favCat(dto);
  }

  @Post('lang')
  changeLangue(@Body() dto: changeLangDto) {
    return this.service.changeLang(dto);
  }

  @Get(':id')
  favorites(@Param() dto: DeviceQueryDto) {
    return this.service.getDeviceWithFav(dto.id);
  }

  @Patch(':id')
  update(@Param() dto: DeviceQueryDto) {
    return this.service.update(dto.id);
  }

  @Get('myads/:id')
  myAds(@Query() dto: DeviceQueryDto) {
    return this.service.getMyAds(dto.id);
  }

  @Post('view')
  adview(@Body() dto: DeviceAdViewDto) {
    return this.service.recordView(dto);
  }

  @Post('view/bulk')
  adviewBulk(@Body() dto: DeviceAdViewBulkDto) {
    return this.service.recordBulkViews(dto);
  }
}
