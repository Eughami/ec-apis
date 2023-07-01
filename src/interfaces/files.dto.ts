import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CategoriesEnum } from 'src/enums/categories.enum';
import { FileTypes } from 'src/enums/filetypes.enum';

export class FileParams {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(FileTypes)
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(CategoriesEnum)
  category: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
