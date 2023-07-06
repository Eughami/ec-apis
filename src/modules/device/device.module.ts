import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { Device } from 'src/entities/Device.entity';
import { Category } from 'src/entities/Category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Device, Category])],
  providers: [DeviceService],
  controllers: [DeviceController],
  exports: [DeviceService],
})
export class DeviceModule {}
