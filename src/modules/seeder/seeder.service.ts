import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/Category.entity';
import { CategoriesEnum } from 'src/enums/categories.enum';
import { Repository } from 'typeorm';
import fs from 'fs';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectRepository(Category) public categoryRepo: Repository<Category>,
  ) {}
  async onModuleInit() {
    console.log('Module Initialized');
    const categories = await this.categoryRepo.find();
    if (categories.length) return;
    Object.keys(CategoriesEnum).map((key) => {
      this.categoryRepo.save({ name: key });
      const rootPath = process.cwd();
      fs.mkdirSync(`${rootPath}/files/images/${key}`);
      fs.mkdirSync(`${rootPath}/files/videos/${key}`);
    });
  }
}
