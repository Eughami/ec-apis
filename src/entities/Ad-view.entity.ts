import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Ad } from './Ad.entity';
import { CoreEntity } from './core.entity';

@Entity()
export class AdView extends CoreEntity {
  @Column({ type: 'text', nullable: true })
  clientType?: string;

  @Column({ type: 'text', nullable: true })
  clientName?: string;

  @Column({ type: 'text', nullable: true })
  clientVersion?: string;

  @Column({ type: 'text', nullable: true })
  osName?: string;

  @Column({ type: 'text', nullable: true })
  osVersion?: string;

  @Column({ type: 'text', nullable: true })
  deviceType?: string;

  @Column({ type: 'text', nullable: true })
  deviceBrand?: string;

  @ManyToOne((type) => Ad)
  @JoinColumn()
  ad: Ad;
}
