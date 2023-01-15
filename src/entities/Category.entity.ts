import { Column, Entity, OneToMany } from 'typeorm';
import { Ad } from './Ad.entity';
import { CoreEntity } from './core.entity';

@Entity()
export class Category extends CoreEntity {
  @Column({ type: 'text', unique: true, nullable: false })
  name: string;

  @OneToMany((type) => Ad, (ad) => ad.category)
  ads: Ad[];
}
