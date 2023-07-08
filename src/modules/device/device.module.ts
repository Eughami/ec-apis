import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { Device } from 'src/entities/Device.entity';
import { Category } from 'src/entities/Category.entity';
import { Ad } from 'src/entities/Ad.entity';
import { AdView } from 'src/entities/Ad-view.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Device, Category, Ad, AdView])],
  providers: [DeviceService],
  controllers: [DeviceController],
  exports: [DeviceService],
})
export class DeviceModule {}
