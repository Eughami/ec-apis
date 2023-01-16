import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtendedCrudService } from 'src/core-configs/extended-crud-service.service';
import { Ad } from 'src/entities/Ad.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdsService extends ExtendedCrudService<Ad> {
  constructor(@InjectRepository(Ad) repo: Repository<Ad>) {
    super(repo, true);
  }
}
