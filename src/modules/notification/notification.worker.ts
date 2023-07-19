// notification.worker.ts
import {
  Processor,
  Process,
  OnQueueCompleted,
  OnQueueActive,
} from '@nestjs/bull';
import { Job } from 'bull';
import { NotificationService } from './notification.service';
import { DeviceFavNotifications } from 'src/interfaces/notification.dto';
import { PinoLogger } from 'nestjs-pino';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from 'src/entities/Device.entity';
import { Repository } from 'typeorm';
import { LanguagesEnum } from 'src/enums/langugages.enum';
import { CategoriesEN, CategoriesFR } from 'src/enums/categories.enum';

@Processor('notification')
export class NotificationWorker {
  constructor(
    @InjectRepository(Device) public deviceRepo: Repository<Device>,
    private readonly pushNotificationService: NotificationService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(NotificationWorker.name);
  }

  singleCategoryNotification(
    token: string,
    category: string,
    lang: LanguagesEnum,
  ): ExpoPushMessage {
    const title =
      lang === LanguagesEnum.fr
        ? CategoriesFR[category]
        : CategoriesEN[category];
    const description =
      lang === LanguagesEnum.fr
        ? `Des nouvelles annonces sur les ${CategoriesFR[category]} pourraient vous intéresser`
        : `${CategoriesEN[category]} has some new ads you might like`;
    return {
      to: token,
      title: title,
      body: description,
      data: {
        category,
        type: 'SINGLE_CATEGORY',
      },
      priority: 'high',
    };
  }

  multiCategoryNotification(
    token: string,
    lang: LanguagesEnum,
  ): ExpoPushMessage {
    const title = lang === LanguagesEnum.fr ? 'Nouvelles Annonces' : 'New Ads';
    const description =
      lang === LanguagesEnum.fr
        ? 'Vos catégories favorites ont de nouvelles annonces qui pourraient vous intéresser'
        : 'Your favorites categories have some new ads you might like';
    return {
      to: token,
      title: title,
      body: description,
      data: {
        category: null,
        type: 'MULTI_CATEGORY',
      },
      priority: 'high',
    };
  }

  @Process()
  async processNotificationJob(job: Job<DeviceFavNotifications[]>) {
    try {
      const expo = new Expo();
      const messages = [];

      for (const ds of job.data) {
        const keys = Object.keys(ds)[0].split('__');
        const token = keys[0];
        const lang: any = keys[1] ?? LanguagesEnum.en;
        const categories = ds[token];
        if (categories.length > 1)
          messages.push(this.multiCategoryNotification(token, lang));
        else
          messages.push(
            this.singleCategoryNotification(token, categories[0], lang),
          );
      }
      this.logger.info(messages, 'Sending these notifications with expo');
      const chunks = expo.chunkPushNotifications(messages);
      const tickets = [];
      for (const chunk of chunks) {
        try {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
          // NOTE: If a ticket contains an error code in ticket.details.error, you
          // must handle it appropriately. The error codes are listed in the Expo
          // documentation:
          // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
        } catch (error) {
          this.logger.error('Expo Push notification failed');
          this.logger.error(error);
        }
      }

      this.logger.info(tickets, 'Expo notification tickets : ');

      /**
       * * Disable the notification for that device if this error happens
       */
      for (const ticket of tickets) {
        if (
          ticket.status === 'error' &&
          ticket.details.error === 'DeviceNotRegistered'
        ) {
          this.deviceRepo.update(
            { token: ticket.details.expoPushToken },
            {
              sendNotification: false,
            },
          );
        }
      }
      // TODO. In the future check for receipts to handle any issue from the expo side
    } catch (error) {
      this.logger.error('Error occured while sending notifiations');
      this.logger.error(error);
    }
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.info(
      `Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(
        job.data,
      )}`,
    );
  }

  @OnQueueCompleted()
  public async onComplete(job: Job) {
    this.logger.info({ message: `Job ${job.name}:${job.id} completed` });
  }
}
