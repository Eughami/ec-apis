import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { CategoriesEnum } from 'src/enums/categories.enum';
import { FileTypes } from 'src/enums/filetypes.enum';

export class NewAdPayload {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  price: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(CategoriesEnum)
  category: CategoriesEnum;

  @ApiProperty()
  @IsOptional()
  @IsString()
  isService: string;

  @ApiProperty()
  @IsUUID('4')
  deviceId: string;
}

export class FilePayload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}
