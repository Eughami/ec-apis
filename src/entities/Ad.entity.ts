import { CrudValidationGroups } from '@nestjsx/crud';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AdView } from './Ad-view.entity';
import { Category } from './Category.entity';
import { CoreEntity } from './core.entity';
import { User } from './User.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity()
export class Ad extends CoreEntity {
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString()
  @MinLength(10)
  @Column({ type: 'text', nullable: false })
  title: string;

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
  isPremium: boolean;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsNumber()
  @IsPositive()
  @Column({ type: 'smallint', nullable: false })
  price: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => AdView, (adView) => adView.ad)
  views: AdView[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
