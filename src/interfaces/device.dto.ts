import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
} from 'class-validator';
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

export class DeviceAdViewDto {
  @ApiProperty()
  @IsUUID('4')
  deviceId: string;

  @ApiProperty()
  @IsUUID('4')
  adId: string;
}

export class DeviceAdViewBulkDto {
  @ApiProperty({
    isArray: true,
    type: DeviceAdViewDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeviceAdViewDto)
  bulk: DeviceAdViewDto[];
}
