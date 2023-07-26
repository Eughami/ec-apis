import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdsModule } from './modules/ads/ads.module';
import { envConfig } from './core-configs/configuration';
import { DbConnectionModule } from './core-configs/db-connection.module';
import { UsersModule } from './modules/users/users.module';
import { AdViewsModule } from './modules/ad-views/ad-views.module';
import { SeederModule } from './modules/seeder/seeder.module';
import { LoggerModule } from 'nestjs-pino';
import { LoggerConfig } from './core-configs/logger.config';
import { FilesModule } from './modules/files/files.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './Taskservice';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/Device.entity';
import { HDT } from './entities/hdt.entity';
import { DeviceModule } from './modules/device/device.module';
import { Ad } from './entities/Ad.entity';
import { BullModule } from '@nestjs/bull';
import { NotificationModule } from './modules/notification/notification.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { CustomExceptionFilter } from './custom-exception-filter';
import { HeaderGuard } from './header.guard';
@Module({
  imports: [
    TypeOrmModule.forFeature([Device, HDT, Ad]),
    ConfigModule.forRoot({ isGlobal: true, load: [envConfig] }),
    LoggerModule.forRoot(LoggerConfig),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
        },
      }),
      inject: [ConfigService],
    }),
    DbConnectionModule,
    SeederModule,
    UsersModule,
    AdsModule,
    AdViewsModule,
    FilesModule,
    DeviceModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: HeaderGuard,
    },
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    TasksService,
  ],
})
export class AppModule {}
