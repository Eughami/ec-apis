import { CrudValidationGroups } from '@nestjsx/crud';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Entity, Column, OneToMany } from 'typeorm';
import { Ad } from './Ad.entity';
import { CoreEntity } from './core.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity()
export class User extends CoreEntity {
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString()
  @MinLength(2)
  @Column({ type: 'text', nullable: false })
  firstName: string;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString()
  @MinLength(2)
  @Column({ type: 'text', nullable: false })
  lastName: string;

  @IsOptional()
  @IsBoolean()
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @IsOptional()
  @IsString()
  @Column({ type: 'text', nullable: true })
  accessToken: string;

  @IsOptional()
  @Column({ type: 'timestamptz', nullable: true })
  lastLogin?: Date;

  @IsOptional()
  @Column({ type: 'timestamptz', nullable: true })
  lastSeenAt?: Date;

  @OneToMany(() => Ad, (ad) => ad.user)
  userAds: Ad[];
}
