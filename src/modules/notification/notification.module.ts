// notification.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationWorker } from './notification.worker';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from 'src/entities/Device.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Device]),
    BullModule.registerQueue({
      name: 'notification',
      // To Avoid sending multiple notification in case of server restart and jobs being in the queue.
      // limiter: {
      //   duration: 60000,
      //   max: 1,
      // },
      // Add any desired configuration options for the task queue
    }),
  ],
  providers: [NotificationWorker, NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
