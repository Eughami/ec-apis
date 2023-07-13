import { CrudValidationGroups } from '@nestjsx/crud';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AdView } from './Ad-view.entity';
import { Category } from './Category.entity';
import { CoreEntity } from './core.entity';
import { User } from './User.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Attachment } from './attachment.entity';
import { Device } from './Device.entity';
import { LanguagesEnum } from 'src/enums/langugages.enum';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity()
export class Ad extends CoreEntity {
  @ApiProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString()
  @MinLength(10)
  @Column({ type: 'text', nullable: false })
  title: string;

  @ApiProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString()
  @Length(8)
  @Column({ type: 'text', nullable: false })
  phone: string;

  @ApiProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString()
  @MinLength(10)
  @Column({ type: 'text', nullable: false })
  description: string;

  @IsOptional()
  @Column({ type: 'text', nullable: true })
  verificationToken?: string;

  @IsBoolean()
  @IsOptional()
  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @IsBoolean()
  @IsOptional()
  @Column({ type: 'boolean', default: false })
  isService: boolean;

  @IsBoolean()
  @IsOptional()
  @Column({ type: 'boolean', default: false })
  isPremium: boolean;

  @ApiProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsNumber()
  @IsPositive()
  @Column({ type: 'bigint', nullable: true })
  price: number;

  @Column({ type: 'enum', enum: LanguagesEnum })
  lang: LanguagesEnum;

  @Column({ type: 'text', nullable: true })
  subtitle: string;

  @Column({ type: 'text', nullable: true })
  subdesc: string;

  @ApiProperty()
  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => AdView, (adView) => adView.ad)
  views: AdView[];

  @OneToMany(() => Attachment, (attachment) => attachment.ad)
  attachment: Attachment[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Device)
  @JoinColumn({ name: 'device_id' })
  device: Device;
}
