import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from 'src/common/entities/brand.entity';
import { Media } from 'src/common/entities/media.entity';
import { TypeMedia } from 'src/common/enums/media/type-media.enum';
import { CreateBrandCommand } from '../implements/create-brand.command';

@CommandHandler(CreateBrandCommand)
export class CreateBrandHandler implements ICommandHandler<CreateBrandCommand> {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async execute(command: CreateBrandCommand): Promise<Brand> {
    const { createBrandDto, file } = command;

    let imageMedia: Media | undefined = undefined;
    if (file) {
      imageMedia = this.mediaRepository.create({
        url: `/uploads/brands/${file.filename}`,
        type: TypeMedia.BRAND_THUMBNAIL,
      });
      imageMedia = await this.mediaRepository.save(imageMedia);
    } else {
      imageMedia = this.mediaRepository.create({
        url: `/uploads/brands/brand-default.png`,
        type: TypeMedia.BRAND_THUMBNAIL,
      });
      imageMedia = await this.mediaRepository.save(imageMedia);
    }

    const brand = this.brandRepository.create({
      ...createBrandDto,
      image_id: imageMedia ? imageMedia.id : undefined,
    });

    return await this.brandRepository.save(brand);
  }
}
