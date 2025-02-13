import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtendedCrudService } from 'src/core-configs/extended-crud-service.service';
import { Ad } from 'src/entities/Ad.entity';
import { Attachment } from 'src/entities/attachment.entity';
import { FilePayload, NewAdPayload } from 'src/interfaces/ad.dto';
import { In, Repository } from 'typeorm';
import { FilesService } from '../files/files.service';
import { Category } from 'src/entities/Category.entity';
import { FileTypes } from 'src/enums/filetypes.enum';
import { PinoLogger } from 'nestjs-pino';
import { Log } from 'src/entities/Log.entity';
import { AdView } from 'src/entities/Ad-view.entity';
import { CrudRequest } from '@nestjsx/crud';
import { LanguagesEnum } from 'src/enums/langugages.enum';
import { Mistral } from '@mistralai/mistralai';

// this is to use ESM modules
let franc;
eval(`import('franc-min')`).then((module) => {
  franc = module.franc;
});

@Injectable()
export class AdsService extends ExtendedCrudService<Ad> {
  constructor(
    @InjectRepository(Ad) public repo: Repository<Ad>,
    @InjectRepository(AdView) public adViewRepo: Repository<AdView>,
    @InjectRepository(Attachment) public attachmentRepo: Repository<Attachment>,
    @InjectRepository(Category) public categoryRepo: Repository<Category>,
    @InjectRepository(Log) public logRepo: Repository<Log>,
    private readonly filesService: FilesService,
    private readonly logger: PinoLogger,
  ) {
    super(repo, true);
    this.logger.setContext(AdsService.name);
  }

  getLang(text: string): LanguagesEnum {
    let lang = franc(text, {
      only: ['fra', 'eng'],
    });
    if (lang !== LanguagesEnum.und)
      lang = lang === 'fra' ? LanguagesEnum.fr : LanguagesEnum.en;
    return lang;
  }

  async openAiTranslation(
    title: string,
    description: string,
    isFrench: boolean,
  ) {
    try {
      const mistral = new Mistral({
        apiKey: process.env['MISTRAL_API_KEY'] ?? '',
      });

      const s = performance.now();
      const translateTo = isFrench ? 'english' : 'french';

      const result = await mistral.chat.complete({
        model: 'mistral-small-latest',
        stream: false,
        responseFormat: { type: 'json_object' },
        messages: [
          {
            content:
              'You are an expert translator for an ad business. translate values inside this json to ' +
              translateTo +
              '.DO NOT CHANGE THE KEYS AND DO NO GIVE ANY OTHER RESPONSE.BE PROFESSIONAL AND TRY TO CONVEY THE MEANING AS BEST AS POSSIBLE.\n' +
              JSON.stringify({ key1: title, key2: description }),
            role: 'user',
          },
        ],
      });

      this.logger.info(result, 'MistralAI.response');
      const res: string[] = Object.values(
        JSON.parse(result.choices[0].message.content as string),
      );

      console.log({
        type: 'MISTRAL_AI_CALL',
        payload: performance.now() - s,
      });
      return { title: res[0], description: res[1] };
    } catch (err: any) {
      this.logger.error('AI translation request failed');
      this.logger.error(err?.response?.data || err);
    }
  }

  async createAd(dto: NewAdPayload, files: FilePayload[] = []) {
    try {
      const category = await this.categoryRepo.findOne({
        where: { name: dto.category },
      });
      const lang = this.getLang(dto.description);
      let oldDate = new Date().toISOString();
      if (dto.adDate) {
        oldDate = new Date(dto.adDate).toISOString();
      }

      const ad = await this.repo.save({
        title: dto.title,
        description: dto.description,
        price: parseInt(dto.price) || undefined,
        isService: dto.isService === 'false',
        phone: dto.phone,
        lang,
        isPremium: dto.isPremium === 'false',
        createdAt: oldDate,
        updatedAt: oldDate,
        category,
        device: { id: dto.deviceId },
      });

      // Save Attachment
      let index = 0;
      for (const file of files) {
        const type = file.mimetype.startsWith('image')
          ? FileTypes.images
          : FileTypes.videos;
        const { buffer, originalname } = file;
        const res = await this.filesService.saveAttachment(
          type,
          dto.category,
          originalname,
          buffer,
          ad.id,
          index++,
        );
        if (!res.success) {
          this.repo.softRemove(ad);
          throw new BadRequestException(res.msg);
        }
      }

      if (lang !== LanguagesEnum.und) {
        const translations = await this.openAiTranslation(
          ad.title,
          ad.description,
          ad.lang === LanguagesEnum.fr,
        );
        if (translations.description && translations.title) {
          await this.repo.update(ad.id, {
            subtitle: translations.title,
            subdesc: translations.description,
          });
        }
      }

      return ad;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException(err);
    }
  }

  /**
   * * to activate ad after verification in the future
   * @param id
   */
  async ActivateAd(id: string) {
    this.repo.update(id, { isVerified: true });
  }

  /**
   * * to save some stats about the users again move this in a seperate module if needed in the future
   * @param body
   */
  async startup(body: Partial<Log>) {
    await this.logRepo.save(body);
  }

  /**
   * * Top ads for last week
   * @returns Ads[]
   */
  async trending() {
    const topAds = await this.adViewRepo
      .createQueryBuilder('views')
      .select(['ad.id', 'count(*)'])
      .leftJoinAndSelect('views.ad', 'ad')
      .where(`views.createdAt > NOW() - INTERVAL '1 week'`)
      .andWhere('ad.id IS NOT NULL')
      .groupBy('ad.id')
      .orderBy('count', 'DESC')
      .limit(20)
      .getRawMany();

    if (!topAds.length) return { data: [] };
    const viewPerAd = {};
    topAds.forEach((t) => (viewPerAd[t.ad_id] = t.count));
    const ads = await this.repo.find({
      where: { id: In(Object.keys(viewPerAd)) },
      relations: ['category', 'attachment'],
    });
    return {
      data: ads.map((a) => ({ ...a, count: viewPerAd[a.id] })),
    };
  }

  async getOne(req: CrudRequest): Promise<Ad & { count: number }> {
    const ad = await super.getOne(req);
    const count = await this.adViewRepo.count({ where: { ad } });
    return { ...ad, count: count };
  }
}
