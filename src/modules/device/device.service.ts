import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdView } from 'src/entities/Ad-view.entity';
import { Ad } from 'src/entities/Ad.entity';
import { Category } from 'src/entities/Category.entity';
import { Device } from 'src/entities/Device.entity';
import { DeviceAdViewDto, FavCat } from 'src/interfaces/device.dto';
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
    this.adviewRepo.save({
      ad: { id: dto.adId },
      device: { id: dto.deviceId },
    });
  }
}
