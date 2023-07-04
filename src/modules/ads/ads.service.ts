import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtendedCrudService } from 'src/core-configs/extended-crud-service.service';
import { Ad } from 'src/entities/Ad.entity';
import { Attachment } from 'src/entities/attachment.entity';
import { FilePayload, NewAdPayload } from 'src/interfaces/ad.dto';
import { Repository } from 'typeorm';
import { FilesService } from '../files/files.service';
import { Category } from 'src/entities/Category.entity';
import { FileTypes } from 'src/enums/filetypes.enum';
import { PinoLogger } from 'nestjs-pino';
import { Device } from 'src/entities/Device.entity';
import { Log } from 'src/entities/Log.entity';

@Injectable()
export class AdsService extends ExtendedCrudService<Ad> {
  constructor(
    @InjectRepository(Ad) public repo: Repository<Ad>,
    @InjectRepository(Attachment) public attachmentRepo: Repository<Attachment>,
    @InjectRepository(Category) public categoryRepo: Repository<Category>,
    @InjectRepository(Device) public deviceRepo: Repository<Device>,
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
   * * this is to save a new device no need to create a new module just for this endpoint
   * @param dto
   * @returns Device
   */
  async newDevice(dto: Partial<Device>) {
    const device = await this.deviceRepo.save(dto);
    return device;
  }

  /**
   * * to save some stats about the users again move this in a seperate module if needed in the future
   * @param body
   */
  async startup(body: Partial<Log>) {
    this.logRepo.save(body);
  }
}
