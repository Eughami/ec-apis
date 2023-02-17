import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { crudGeneralOptions } from 'src/core-configs/crud.config';
import { User } from 'src/entities/User.entity';
import { UsersService } from './users.service';

@Crud({
  ...crudGeneralOptions,
  model: {
    type: User,
  },
  routes: {
    only: ['getOneBase'],
  },
  query: {
    ...crudGeneralOptions.query,
    maxLimit: 500,
  },
})
@ApiTags('Users')
@Controller('users')
export class UsersController implements CrudController<User> {
  constructor(public readonly service: UsersService) {}
}
