import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SeederService } from './seeder.service';

@ApiTags('Seeder')
@Controller('seeder')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}
}
