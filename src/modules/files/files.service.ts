import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import mime from 'mime-types';
import fs from 'fs';
import { PinoLogger } from 'nestjs-pino';
import { CategoriesEnum } from 'src/enums/categories.enum';
import { GenericResponse } from 'src/interfaces/generic.dto';
import { FileTypes } from 'src/enums/filetypes.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment } from 'src/entities/attachment.entity';
import { Repository } from 'typeorm';
import { join } from 'path';

@Injectable()
export class FilesService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectRepository(Attachment) public attachmentRepo: Repository<Attachment>,
  ) {
    this.logger.setContext(FilesService.name);
  }

  /**
   * * Used to actually validate if a file is from the given type
   * @param buffer
   * @returns
   */
  private checkLogo(buffer: Buffer): boolean {
    const allowedMagicNumbers = [
      '89504E47', // png
      'FFD8FFE0', // following are jpeg magic numbers
      'FFD8FFE1',
      'FFD8FFE2',
      'FFD8FFE3',
      'FFD8FFE8',
    ];

    const fd = buffer.slice(0, 4);
    const uint = new Uint8Array(fd);
    const bytes = [];
    uint.forEach((byte) => {
      bytes.push(byte.toString(16));
    });
    const hex = bytes.join('').toUpperCase();
    return allowedMagicNumbers.includes(hex);
  }

  async serveImage(filename: string, res: Response): Promise<void> {
    res.set('Cache-Control', 'public, max-age=31557600'); // Cache for 1 year
    res.type(mime.lookup(filename)); // Adjust the content type based on your image format

    // TODO.check if this works with docker
    const rootPath = process.cwd();
    const appPath = join(rootPath, 'files', filename);

    const fileStream = fs.createReadStream(appPath);
    // Handling error event
    fileStream.on('error', (err) => {
      this.logger.error(
        err,
        'Something went wrong while trying to stream file:' + appPath,
      );
      res.removeHeader('Cache-Control');
      res.setHeader('content-type', 'text/plain');
      res.status(400).send('Could not process your file');
    });
    fileStream.pipe(res);
  }

  async saveAttachment(
    type: FileTypes,
    category: CategoriesEnum,
    name: string,
    blob: Buffer,
    adId: string,
    position = 0,
  ): Promise<GenericResponse> {
    try {
      const cd = performance.now();
      // TODO.check if this works with docker
      const rootPath = process.cwd();
      const filePath = `${type}/${category}/${name}`;
      const appPath = join(rootPath, 'files', filePath);

      fs.writeFileSync(appPath, blob, {
        encoding: 'binary',
      });
      await this.attachmentRepo.save({
        ad: { id: adId },
        position,
        path: filePath,
      });
      this.logger.info(`Exec time for ${filePath} : ${performance.now() - cd}`);
      return { success: true };
    } catch (error) {
      this.logger.error(error, 'Save Attachment error');
      return { success: false, msg: 'Could not save your file' };
    }
  }
}
