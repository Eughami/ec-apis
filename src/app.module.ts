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
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [envConfig] }),
    LoggerModule.forRoot(LoggerConfig),
    DbConnectionModule,
    SeederModule,
    UsersModule,
    AdsModule,
    AdViewsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
