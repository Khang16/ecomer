import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from 'src/common/entities/brand.entity';
import { Media } from 'src/common/entities/media.entity';
import { TypeMedia } from 'src/common/enums/media/type-media.enum';
import { UpdateBrandCommand } from '../implements/update-brand.command';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateBrandCommand)
export class UpdateBrandHandler implements ICommandHandler<UpdateBrandCommand> {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async execute(command: UpdateBrandCommand): Promise<Brand> {
    const { id, updateBrandDto, file } = command;

    const brand = await this.brandRepository.findOne({ where: { id } });
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    if (file) {
      let imageMedia = this.mediaRepository.create({
        url: `/uploads/brands/${file.filename}`,
        type: TypeMedia.BRAND_THUMBNAIL,
      });
      imageMedia = await this.mediaRepository.save(imageMedia);
      brand.image_id = imageMedia.id;
    }

    Object.assign(brand, updateBrandDto);

    return await this.brandRepository.save(brand);
  }
}
