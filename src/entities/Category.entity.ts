import { Column, Entity, OneToMany } from 'typeorm';
import { Ad } from './Ad.entity';
import { CoreEntity } from './core.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Category extends CoreEntity {
  @ApiProperty()
  @Column({ type: 'text', unique: true, nullable: false })
  name: string;

  @OneToMany((type) => Ad, (ad) => ad.category)
  ads: Ad[];
}
