// notification-job-producer.service.ts
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class NotificationService {
  constructor(
    @InjectQueue('notification') private readonly notificationQueue: Queue,
  ) {}

  async scheduleNotificationJob(job /*: NotificationJobDTO*/, delay: number) {
    await this.notificationQueue.add(job, { delay });
    console.log(
      'timestamp : ',
      new Date().toISOString(),
      '. Added a new job to the queue : ',
      job,
    );
  }
}
