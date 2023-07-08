import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeviceService } from './device.service';
import { Device } from 'src/entities/Device.entity';
import {
  DeviceAdViewDto,
  DeviceQueryDto,
  FavCat,
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

  @Get(':id')
  favorites(@Query() dto: DeviceQueryDto) {
    return this.service.getDeviceWithFav(dto.id);
  }

  @Get('myads/:id')
  myAds(@Query() dto: DeviceQueryDto) {
    return this.service.getMyAds(dto.id);
  }

  @Post('view')
  adview(@Body() dto: DeviceAdViewDto) {
    return this.service.recordView(dto);
  }
}
