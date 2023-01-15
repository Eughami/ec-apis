import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdsModule } from './modules/ads/ads.module';
import { envConfig } from './core-configs/configuration';
import { DbConnectionModule } from './core-configs/db-connection.module';
import { UsersModule } from './modules/users/users.module';
import { AdViewsModule } from './modules/ad-views/ad-views.module';
import { SeederModule } from './modules/seeder/seeder.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [envConfig] }),
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
