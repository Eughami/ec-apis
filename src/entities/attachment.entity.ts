import { IsNotEmpty, IsNumber } from 'class-validator';
import { CoreEntity } from './core.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Ad } from './Ad.entity';

@Entity()
export class Attachment extends CoreEntity {
  @IsNotEmpty()
  @IsNumber()
  @Column({ type: 'smallint', default: 0 })
  position: number;

  @Column({ type: 'text', nullable: false })
  path: string;

  @ManyToOne((type) => Ad)
  @JoinColumn()
  ad: Ad;
}
