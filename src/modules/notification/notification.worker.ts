// notification.worker.ts
import { Processor, Process, OnQueueCompleted } from '@nestjs/bull';
import { Job } from 'bull';
import { NotificationService } from './notification.service';

@Processor('notification')
export class NotificationWorker {
  constructor(private readonly pushNotificationService: NotificationService) {}

  @Process()
  async processNotificationJob(job /*: Job<NotificationJobDTO>*/) {
    const { deviceId, content } = job.data;

    // Perform push notification delivery using the PushNotificationService
    // Actually deliver the notification here
    console.log('need to handle the job here', { job });
    // await this.pushNotificationService.sendNotification(deviceId, content);
  }

  @OnQueueCompleted()
  public async onComplete(job: Job) {
    console.log({ message: `Job ${job.name}:${job.id} completed` });
  }
}
