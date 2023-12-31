import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdView } from 'src/entities/Ad-view.entity';
import { Ad } from 'src/entities/Ad.entity';
import { Category } from 'src/entities/Category.entity';
import { Device } from 'src/entities/Device.entity';
import {
  DeviceAdViewBulkDto,
  DeviceAdViewDto,
  FavCat,
  changeLangDto,
} from 'src/interfaces/device.dto';
import { Repository } from 'typeorm';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device) public repo: Repository<Device>,
    @InjectRepository(Ad) public adRepo: Repository<Ad>,
    @InjectRepository(AdView) public adviewRepo: Repository<AdView>,
    @InjectRepository(Category) public categoryRepo: Repository<Category>,
  ) {}

  /**
   * * this is to save a new device no need to create a new module just for this endpoint
   * @param dto
   * @returns Device
   */
  async newDevice(dto: Partial<Device>) {
    let device = await this.repo.findOne({ where: { token: dto.token } });
    if (!device) device = await this.repo.save(dto);
    return device;
  }

  /**
   * * Add Remove favorite category
   * @param dto
   */
  async favCat(dto: FavCat) {
    const device = await this.repo.findOne({
      where: { id: dto.deviceId },
      relations: ['favoriteCategories'],
    });
    const category = await this.categoryRepo.findOne({
      where: { name: dto.category },
    });
    if (!device || !category) throw new NotFoundException();

    const found = device.favoriteCategories.find((c) => c.id === category.id);

    if (!found) device.favoriteCategories.push(category);
    else
      device.favoriteCategories = device.favoriteCategories.filter(
        (c) => c.id !== category.id,
      );
    this.repo.save(device);
    return { success: true };
  }

  async getDeviceWithFav(id: string) {
    const device = await this.repo.findOne({
      where: { id },
      relations: ['favoriteCategories'],
    });
    if (!device) throw new NotFoundException();

    return device;
  }

  async getMyAds(id: string) {
    const ads = await this.adRepo.find({ where: { device: { id } } });
    return ads;
  }

  async recordView(dto: DeviceAdViewDto) {
    await this.adviewRepo.save({
      ad: { id: dto.adId },
      device: { id: dto.deviceId },
    });
  }

  async recordBulkViews(dto: DeviceAdViewBulkDto) {
    const toSave = dto.bulk.map((v) => ({
      ad: { id: v.adId },
      device: { id: v.deviceId },
    }));
    await this.adviewRepo.save(toSave);
  }
  async update(id: string) {
    const device = await this.repo.findOne(id);
    await this.repo.update(id, { sendNotification: !device.sendNotification });
  }
  async changeLang(dto: changeLangDto) {
    return await this.repo.update(dto.deviceId, { lang: dto.lang });
  }
}
