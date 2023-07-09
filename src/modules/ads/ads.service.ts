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

  async createAd(dto: NewAdPayload, files: FilePayload[] = []) {
    console.log(dto);
    try {
      const category = await this.categoryRepo.findOne({
        where: { name: dto.category },
      });
      console.log({ category });
      const ad = await this.repo.save({
        title: dto.title,
        description: dto.description,
        price: parseInt(dto.price) || undefined,
        isService: dto.isService === 'false',
        phone: dto.phone,
        category,
        device: { id: dto.deviceId },
      });
      console.log({ ad });

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
        console.log({ res });
        if (!res.success) {
          this.repo.softRemove(ad);
          throw new BadRequestException(res.msg);
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

    const viewPerAd = {};
    topAds.forEach((t) => (viewPerAd[t.ad_id] = t.count));
    console.log(viewPerAd);
    const ads = await this.repo.find({
      where: { id: In(Object.keys(viewPerAd)) },
      relations: ['category', 'attachment'],
    });
    return {
      data: ads.map((a) => ({ ...a, count: viewPerAd[a.id] })),
    };
  }
}
