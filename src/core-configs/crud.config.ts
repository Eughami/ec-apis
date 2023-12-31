import { CrudOptions } from '@nestjsx/crud';

export const crudGeneralOptions: Partial<CrudOptions> = {
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  query: {
    maxLimit: 100,
    alwaysPaginate: true,
    exclude: ['password', 'accessToken', 'verificationToken'],
    join: {},
  },
};
