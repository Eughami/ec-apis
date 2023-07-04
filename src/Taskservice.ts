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

  // TODO.make it every day at 09H, 15H, 22H
  @Cron('39 21 * * *', { timeZone: 'Africa/Djibouti' })
  async handleMorning() {
    const devices = await this.deviceRepo.find({
      where: { modelName: 'boobi' },
    });

    const ds = [
      {
        imageuri: `Snapchat-654578280.jpg`,
        quote: 'You are the missing piece that completes my puzzle of life.',
      },
      {
        imageuri: `IMG_20230509_134257.jpg`,
        quote: 'In your arms, I found my safe haven.',
      },
      {
        imageuri: `IMG_20230509_134250.jpg`,
        quote: 'Every day with you is like a beautiful love story unfolding.',
      },
      {
        imageuri: `IMG_20230509_134245.jpg`,
        quote: 'You are the melody that brings harmony to my heart.',
      },
      {
        imageuri: `IMG_20230508_154401.jpg`,
        quote: "With you, I've discovered a love that knows no bounds.",
      },
      {
        imageuri: `IMG_20230421_181638.jpg`,
        quote: 'Your smile has the power to brighten even the darkest of days.',
      },
      {
        imageuri: `IMG_20230421_181636.jpg`,
        quote: 'You are the reason my heart skips a beat.',
      },
      {
        imageuri: `IMG_20230421_181635.jpg`,
        quote:
          'In your eyes, I see a reflection of a love that is pure and true.',
      },
      {
        imageuri: `IMG_20230421_181629.jpg`,
        quote: 'You are the sweetest chapter in the book of my life.',
      },
      {
        imageuri: `IMG_20230226_115144.jpg`,
        quote: "Your love is the most precious gift I've ever received.",
      },
      {
        imageuri: `IMG_20230226_115120.jpg`,
        quote:
          'I fall in love with you all over again every time I look into your eyes.',
      },
      {
        imageuri: `IMG_20230226_115114.jpg`,
        quote: "With you, I've learned that love knows no distance.",
      },
      {
        imageuri: `IMG_20230226_115110.jpg`,
        quote: 'You are the light that guides me through the darkest nights.',
      },
      {
        imageuri: `IMG_20230214_214828.jpg`,
        quote: 'Every moment spent with you is a moment I cherish forever.',
      },
      {
        imageuri: `IMG_20230214_214824.jpg`,
        quote: 'You make my heart dance to a rhythm only you can create.',
      },
      {
        imageuri: `IMG_20230214_214821.jpg`,
        quote: 'Your love is the key that unlocks the door to my happiness.',
      },
      {
        imageuri: `IMG_20230214_214818.jpg`,
        quote: 'In a world full of chaos, you are my peaceful oasis.',
      },
      {
        imageuri: `IMG_20230214_214812.jpg`,
        quote: 'You are the muse that inspires the poetry of my soul.',
      },
      {
        imageuri: `IMG_20230214_214759.jpg`,
        quote: 'You are the reason I believe in miracles.',
      },
      {
        imageuri: `IMG_20230214_214756.jpg`,
        quote:
          "With you, I've discovered the true meaning of unconditional love.",
      },
      {
        imageuri: `IMG_20230214_124331.jpg`,
        quote: 'You are the embodiment of beauty, both inside and out.',
      },
      {
        imageuri: `IMG_20230214_124330.jpg`,
        quote: "I'm grateful for every day I get to spend by your side.",
      },
      {
        imageuri: `IMG_20230212_155212.jpg`,
        quote: 'Your love has the power to heal even the deepest wounds.',
      },
      {
        imageuri: `IMG_20230212_155208.jpg`,
        quote: 'With you, I feel like the luckiest person alive.',
      },
      {
        imageuri: `IMG_20230211_141419.jpg`,
        quote: 'You are my forever and always.',
      },
      {
        imageuri: `IMG_20230211_140714.jpg`,
        quote: 'Your love is the anchor that keeps me grounded.',
      },
      {
        imageuri: `IMG_20230211_140710.jpg`,
        quote: "Every time I see you, my heart whispers, 'There you are.'",
      },
      {
        imageuri: `IMG_20220726_204607.jpg`,
        quote: "With you, I've found a love that feels like coming home.",
      },
      {
        imageuri: `IMG_20220724_170050.jpg`,
        quote: 'You are the reason my heart sings with joy.',
      },
      {
        imageuri: `IMG_20220709_213241.jpg`,
        quote:
          "Your love is the compass that guides me through life's journey.",
      },
      {
        imageuri: `IMG_20220708_224842.jpg`,
        quote: 'You are the epitome of grace and elegance.',
      },
      {
        imageuri: `IMG_20230508_132655.jpg`,
        quote: "In your embrace, I've found solace and serenity.",
      },
      {
        imageuri: `IMG_20230226_115117.jpg`,
        quote: 'You make ordinary moments extraordinary with your presence.',
      },
      {
        imageuri: `IMG_20230214_214831.jpg`,
        quote: "With you, I've discovered the true meaning of happiness.",
      },
      {
        imageuri: `IMG_20230211_140719.jpg`,
        quote: 'Your love is the gentle breeze that soothes my weary soul.',
      },
      {
        imageuri: `IMG_20220730_180523.jpg`,
        quote: 'You are the answer to all my prayers and wishes.',
      },
      {
        imageuri: `IMG_20220730_085018.jpg`,
        quote: 'In your eyes, I see a love that is as vast as the ocean.',
      },
      {
        imageuri: `IMG_20220730_085016.jpg`,
        quote: 'You are my sunshine on the cloudiest days.',
      },
      {
        imageuri: `IMG_20220226_171939.jpg`,
        quote: "With you, I've learned that love is the greatest adventure.",
      },
      {
        imageuri: `IMG_20220204_224756.jpg`,
        quote: 'Your love is the fuel that ignites the fire within me.',
      },
      {
        imageuri: `IMG-20230503-WA0013.jpg`,
        quote: 'You are the melody that plays on repeat in my heart.',
      },
      {
        imageuri: `IMG-20230503-WA0012.jpg`,
        quote: 'In your smile, I find the motivation to be a better person.',
      },
      {
        imageuri: `IMG-20230503-WA0011.jpg`,
        quote: 'You are the reason I believe in happily ever after.',
      },
      {
        imageuri: `IMG-20230503-WA0010.jpg`,
        quote: "With you, I've found a love that transcends space and time.",
      },
      {
        imageuri: `IMG-20230503-WA0009.jpg`,
        quote:
          'Your love is the glue that holds the pieces of my heart together.',
      },
      {
        imageuri: `IMG-20230227-WA0006.jpg`,
        quote: 'You are the light that brightens up my world.',
      },
      {
        imageuri: `IMG-20230227-WA0005.jpg`,
        quote: "In your arms, I've found my true home.",
      },
      {
        imageuri: `IMG-20230227-WA0004.jpg`,
        quote: 'You are the treasure I will cherish for a lifetime.',
      },
      {
        imageuri: `IMG-20230227-WA0001.jpg`,
        quote: "With you, I've learned that love is the greatest gift of all.",
      },
      {
        imageuri: `IMG-20220612-WA0026.jpg`,
        quote: 'Your love is the sweetest melody that plays in my heart.',
      },
      {
        imageuri: `IMG-20220418-WA0003.jpg`,
        quote: 'You are the reason behind my constant smile.',
      },
    ];

    for (const d of ds) {
      this.HDTRepo.save(d);
    }
    console.log('Call the send notification function', devices);
  }

  @Cron('0 15 * * *', { timeZone: 'Africa/Djibouti' })
  handleAfternoon() {
    console.log('Call the send notification function');
  }

  @Cron('0 22 * * *', { timeZone: 'Africa/Djibouti' })
  handleNight() {
    console.log('Call the send notification function');
  }
}
