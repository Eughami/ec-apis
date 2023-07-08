import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './entities/Device.entity';
import { PinoLogger } from 'nestjs-pino';
import { HDT } from './entities/hdt.entity';
import { Ad } from './entities/Ad.entity';
import { NotificationService } from './modules/notification/notification.service';
import { DeviceFavNotifications } from './interfaces/notification.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectRepository(Device) public deviceRepo: Repository<Device>,
    @InjectRepository(Ad) public adRepo: Repository<Device>,
    @InjectRepository(HDT) public HDTRepo: Repository<HDT>,
    private readonly notificationJobProducerService: NotificationService,
  ) {
    this.logger.setContext(TasksService.name);
  }
  sendNotification = async () => {
    const devices = await this.deviceRepo.find({
      where: { modelName: 'boobi' },
    });
    const nt = await this.HDTRepo.findOne();
    if (devices.length && nt) {
      const myHeaders = new Headers();
      myHeaders.append('host', 'exp.host');
      myHeaders.append('accept', 'application/json');
      myHeaders.append('accept-encoding', 'gzip, deflate');
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        to: devices.map((d) => d.token),
        title: 'Boobiiiiii',
        body: 'Daily Dose of vitamin boo',
        data: { quote: nt.quote, imageUrl: nt.imageuri },
      });

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
      };
      fetch('https://exp.host/--/api/v2/push/send', requestOptions)
        .then((res) => {
          res
            .json()
            .then((js) =>
              this.logger.info(js, 'Receipt for HDT notifications'),
            );
          this.HDTRepo.softRemove(nt);
        })
        .catch((err) => this.logger.error(err));
    }
  };

  @Cron('30 9 * * *', { timeZone: 'Africa/Djibouti' })
  handleMorning() {
    this.sendNotification();
  }

  @Cron('0 15 * * *', { timeZone: 'Africa/Djibouti' })
  handleAfternoon() {
    this.sendNotification();
  }

  @Cron('0 23 * * *', { timeZone: 'Africa/Djibouti' })
  handleNight() {
    this.sendNotification();
  }

  @Cron('0 10 * * *', { timeZone: 'Africa/Djibouti' })
  async handleMorningnFavorites() {
    this.sendFavoritesNotifications(12);
  }

  @Cron('0 16 * * *', { timeZone: 'Africa/Djibouti' })
  async handleAfternoonFavorites() {
    this.sendFavoritesNotifications(6);
  }

  @Cron('0 21 * * *', { timeZone: 'Africa/Djibouti' })
  async handleNightFavorites() {
    this.sendFavoritesNotifications(5);
  }

  async sendFavoritesNotifications(numOfHour: number) {
    const xHours = new Date();
    xHours.setHours(xHours.getHours() - numOfHour);
    // get all ads within the last  xHour and get unique categories
    const allAds = await this.adRepo
      .createQueryBuilder('ads')
      .leftJoinAndSelect('ads.category', 'category')
      .select('category.name', 'categoryName')
      .where('ads.createdAt > :dd', { dd: xHours })
      .groupBy('category.name')
      .getRawMany();

    const categoriesName = allAds.map((a) => a.categoryName);
    const ds = await this.deviceRepo
      .createQueryBuilder('devices')
      .leftJoinAndSelect('devices.favoriteCategories', 'favoriteCategories')
      .where('favoriteCategories.name IN (:...categories)', {
        categories: categoriesName,
      })
      .andWhere('devices.sendNotification = true')
      .getMany();

    const devices: DeviceFavNotifications[] = [];
    for (const device of ds) {
      devices.push({
        [device.token]: this.findCommonElements(
          device.favoriteCategories.map((c) => c.name),
          categoriesName,
        ),
      });
    }
    // TODO. Handle sending notification here and put the check for receipts as a job with a 30m delay
    this.notificationJobProducerService.scheduleNotificationJob(devices);
  }
  findCommonElements(array1, array2) {
    const set1 = new Set(array1);
    const commonElements = [];

    for (const element of array2) {
      if (set1.has(element)) {
        commonElements.push(element);
      }
    }

    return commonElements;
  }
}
