// notification.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationWorker } from './notification.worker';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notification',
      // Add any desired configuration options for the task queue
    }),
  ],
  providers: [NotificationWorker, NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
