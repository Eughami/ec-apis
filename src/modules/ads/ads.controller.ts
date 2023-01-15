import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { crudGeneralOptions } from 'src/core-configs/crud.config';
import { Ad } from 'src/entities/Ad.entity';
import { AdsService } from './ads.service';

@Crud({
  ...crudGeneralOptions,
  model: {
    type: Ad,
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'createOneBase', 'updateOneBase'],
  },
  query: {
    ...crudGeneralOptions.query,
    join: {
      category: { eager: true },
      views: { eager: true },
      user: { eager: true },
    },
  },
})
@Controller('ads')
export class AdsController implements CrudController<Ad> {
  constructor(public readonly service: AdsService) {}
}
