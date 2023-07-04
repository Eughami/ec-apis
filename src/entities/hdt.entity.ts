import { Column, Entity } from 'typeorm';
import { CoreEntity } from './core.entity';

@Entity()
export class HDT extends CoreEntity {
  @Column({ type: 'text', nullable: false })
  quote: string;

  @Column({ type: 'text', nullable: false })
  imageuri: string;
}
