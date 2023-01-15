import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtendedCrudService } from 'src/core-configs/extended-crud-service.service';
import { User } from 'src/entities/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService extends ExtendedCrudService<User> {
  constructor(@InjectRepository(User) public repo: Repository<User>) {
    super(repo, true);
  }
}
