import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { CoreEntity } from './core.entity';
import { Ad } from './Ad.entity';
import { AdView } from './Ad-view.entity';
import { Log } from './Log.entity';
import { Category } from './Category.entity';

@Entity()
export class Device extends CoreEntity {
  @Column({ type: 'text', nullable: true })
  token: string;

  @Column({ type: 'text', nullable: true })
  brand: string;

  @Column({ type: 'text', nullable: true })
  designName: string;

  @Column({ type: 'text', nullable: true })
  deviceName: string;

  @Column({ type: 'text', nullable: true })
  deviceYearClass: string;

  @Column({ type: 'text', nullable: true })
  manufacturer: string;

  @Column({ type: 'text', nullable: true })
  modelId: string;

  @Column({ type: 'text', nullable: true })
  modelName: string;

  @Column({ type: 'text', nullable: true })
  osBuildFingerprint: string;

  @Column({ type: 'text', nullable: true })
  osBuildId: string;

  @Column({ type: 'text', nullable: true })
  osInternalBuildId: string;

  @Column({ type: 'text', nullable: true })
  osName: string;

  @Column({ type: 'text', nullable: true })
  osVersion: string;

  @Column({ type: 'text', nullable: true })
  platformApiLevel: string;

  @Column({ type: 'bigint', nullable: true })
  totalMemory: number;

  @Column({ type: 'boolean', default: true })
  sendNotification: boolean;

  @OneToMany(() => Ad, (ad) => ad.device)
  deviceAds: Ad[];

  @OneToMany(() => AdView, (adView) => adView.ad)
  views: AdView[];

  @OneToMany(() => Log, (log) => log.device)
  deviceLogs: Log[];

  @ManyToMany(() => Category)
  @JoinTable()
  favoriteCategories: Category[];
}
