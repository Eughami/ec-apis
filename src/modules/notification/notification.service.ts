// notification-job-producer.service.ts
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { DeviceFavNotifications } from 'src/interfaces/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectQueue('notification') private readonly notificationQueue: Queue,
  ) {}

  async scheduleNotificationJob(job: DeviceFavNotifications[], delay = 0) {
    await this.notificationQueue.add(job, { delay });
  }
}
