import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
@Module({
  imports: [
    TypeOrmModule.forFeature([Device, HDT]),
    ConfigModule.forRoot({ isGlobal: true, load: [envConfig] }),
    LoggerModule.forRoot(LoggerConfig),
    ScheduleModule.forRoot(),
    DbConnectionModule,
    SeederModule,
    UsersModule,
    AdsModule,
    AdViewsModule,
    FilesModule,
  ],
  controllers: [],
  providers: [TasksService],
})
export class AppModule {}
