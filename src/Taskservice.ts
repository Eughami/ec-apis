import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './entities/Device.entity';
import { PinoLogger } from 'nestjs-pino';
import { HDT } from './entities/hdt.entity';
import { Ad } from './entities/Ad.entity';
import { NotificationService } from './modules/notification/notification.service';

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
          console.log(res);
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

  @Cron(CronExpression.EVERY_MINUTE, { timeZone: 'Africa/Djibouti' })
  async handleFavorites() {
    this.notificationJobProducerService.scheduleNotificationJob(
      {
        ds: 'random shit',
        token: 'Expotoken',
        time: `job added at ${new Date().toISOString()}`,
      },
      300000,
    );
    // const twoHoursAgo = new Date();
    // twoHoursAgo.setHours(twoHoursAgo.getHours() - 10);

    // // get all ads within the last 1-2 hour and get unique categories
    // const allAds = await this.adRepo
    //   .createQueryBuilder('ads')
    //   .leftJoinAndSelect('ads.category', 'category')
    //   .select('category.name', 'categoryName')
    //   .where('ads.createdAt > :dd', { dd: twoHoursAgo })
    //   .groupBy('category.name')
    //   .getRawMany();

    // for (const category of allAds.map((a) => a.categoryName)) {
    //   const ds = await this.deviceRepo
    //     .createQueryBuilder('devices')
    //     .leftJoinAndSelect('devices.favoriteCategories', 'favoriteCategories')
    //     .where('favoriteCategories.name = :catName', { catName: category })
    //     .getMany();
    //   // Await 5min between each category notification
    //   // await new Promise((resolve) => setTimeout(resolve, 10000));
    //   console.log({ category, ds });
    //   if (ds.length) {
    //     console.log('Go to the next category');
    //   }
    // }
    // for each category fetch devices having that category as favorite
    // ads each category as a notification per device
    // send a batch to each device
  }
}
