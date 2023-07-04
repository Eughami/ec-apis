import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CoreEntity } from './core.entity';
import { Device } from './Device.entity';

@Entity()
export class Log extends CoreEntity {
  @Column({ type: 'text', nullable: false })
  type: string;

  @Column({ type: 'jsonb', default: {} })
  payload;

  @ManyToOne(() => Device)
  @JoinColumn({ name: 'device_id' })
  device: Device;
}
