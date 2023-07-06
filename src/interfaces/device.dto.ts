import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { CategoriesEnum } from 'src/enums/categories.enum';

export class FavCat {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(CategoriesEnum)
  category: CategoriesEnum;

  @ApiProperty()
  @IsUUID('4')
  deviceId: string;
}

export class DeviceQueryDto {
  @ApiProperty()
  @IsUUID('4')
  id: string;
}
