import { Controller, Get, Param, Request } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { crudGeneralOptions } from 'src/core-configs/crud.config';
import { AdView } from 'src/entities/Ad-view.entity';
import { AdViewsService } from './ad-views.service';
@Crud({
  ...crudGeneralOptions,
  model: {
    type: AdView,
  },
  routes: {
    only: ['getManyBase', 'createOneBase'],
  },
  query: {
    ...crudGeneralOptions.query,
    join: {
      ad: {
        eager: true,
      },
    },
  },
})
@Controller('adViews')
export class AdViewsController implements CrudController<AdView> {
  constructor(public readonly service: AdViewsService) {}

  @Get('save/:id')
  recordView(@Request() req, @Param('id') id: string) {
    const userAgent = req.get('user-agent');
    return this.service.recordView(userAgent, id);
  }
}
