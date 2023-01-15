import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdView } from 'src/entities/Ad-view.entity';
import { Ad } from 'src/entities/Ad.entity';
import { AdViewsController } from './ad-views.controller';
import { AdViewsService } from './ad-views.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdView, Ad])],
  providers: [AdViewsService],
  controllers: [AdViewsController],
  exports: [AdViewsService],
})
export class AdViewsModule {}
