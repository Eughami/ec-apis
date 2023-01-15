import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtendedCrudService } from 'src/core-configs/extended-crud-service.service';
import { AdView } from 'src/entities/Ad-view.entity';
import { Repository } from 'typeorm';
import DeviceDetector = require('device-detector-js');
import { Ad } from 'src/entities/Ad.entity';

@Injectable()
export class AdViewsService extends ExtendedCrudService<AdView> {
  constructor(
    @InjectRepository(AdView) public repo: Repository<AdView>,
    @InjectRepository(Ad) public adRepo: Repository<Ad>,
  ) {
    super(repo, true);
  }

  async recordView(userAgent, adId: string) {
    const deviceDetector = new DeviceDetector();
    const device = deviceDetector.parse(userAgent);

    if (device?.bot) {
      console.warn('Bot attempt was blocked', device);
      return;
    }
    const ad = await this.adRepo.findOne({ where: { id: adId } });
    if (!ad) return;

    const adView: AdView = {
      ad,
      clientName: device?.client?.name,
      clientType: device?.client?.type,
      clientVersion: device?.client?.version,
      deviceBrand: device?.device?.brand,
      deviceType: device?.device?.type,
      osName: device?.os?.name,
      osVersion: device?.os?.version,
    };
    this.repo.save(adView);
  }
}
