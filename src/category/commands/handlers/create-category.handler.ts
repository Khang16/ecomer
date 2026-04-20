import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from 'src/common/entities/product-categories.entity';
import { Media } from 'src/common/entities/media.entity';
import { TypeMedia } from 'src/common/enums/media/type-media.enum';
import { CreateCategoryCommand } from '../implements/category.command';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler
  implements ICommandHandler<CreateCategoryCommand>
{
  constructor(
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async execute(command: CreateCategoryCommand): Promise<ProductCategory> {
    const { createCategoryDto, file } = command;

    let imageMedia: Media | undefined = undefined;
    if (file) {
      imageMedia = this.mediaRepository.create({
        url: `/uploads/categories/${file.filename}`,
        type: TypeMedia.CATEGORY_THUMBNAIL,
      });
      imageMedia = await this.mediaRepository.save(imageMedia);
    } else {
      imageMedia = this.mediaRepository.create({
        url: `/uploads/categories/category-default.png`,
        type: TypeMedia.CATEGORY_THUMBNAIL,
      });
      imageMedia = await this.mediaRepository.save(imageMedia);
    }

    const category = this.categoryRepository.create({
      ...createCategoryDto,
      image_id: imageMedia ? imageMedia.id : undefined,
    });

    return await this.categoryRepository.save(category);
  }
}
