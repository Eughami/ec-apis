import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './entities/Device.entity';
import { PinoLogger } from 'nestjs-pino';
import { HDT } from './entities/hdt.entity';

@Injectable()
export class TasksService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectRepository(Device) public deviceRepo: Repository<Device>,
    @InjectRepository(HDT) public HDTRepo: Repository<HDT>,
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

  @Cron('20 22 * * *', { timeZone: 'Africa/Djibouti' })
  handleMorning() {
    this.sendNotification();
  }

  @Cron('0 15 * * *', { timeZone: 'Africa/Djibouti' })
  handleAfternoon() {
    this.sendNotification();
  }

  @Cron('0 22 * * *', { timeZone: 'Africa/Djibouti' })
  handleNight() {
    this.sendNotification();
  }
}
