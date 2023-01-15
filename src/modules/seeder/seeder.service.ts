import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/Category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectRepository(Category) public categoryRepo: Repository<Category>,
  ) {}
  async onModuleInit() {
    console.log('Module Initialized');
    const categories = await this.categoryRepo.find();
    if (categories.length) return;
    try {
      const c = await this.categoryRepo.save({
        name: 'Test Category',
      });
      console.log(c);
    } catch (error) {
      console.error(error);
    }
  }
}
