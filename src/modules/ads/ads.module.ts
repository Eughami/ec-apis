import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdView } from 'src/entities/Ad-view.entity';
import { Ad } from 'src/entities/Ad.entity';
import { Category } from 'src/entities/Category.entity';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';
import { Attachment } from 'src/entities/attachment.entity';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ad, AdView, Category, Attachment]),
    FilesModule,
  ],
  providers: [AdsService],
  controllers: [AdsController],
  exports: [AdsService],
})
export class AdsModule {}
