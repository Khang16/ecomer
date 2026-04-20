import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from 'src/common/entities/product-categories.entity';
import { Media } from 'src/common/entities/media.entity';
import { TypeMedia } from 'src/common/enums/media/type-media.enum';
import { UpdateCategoryCommand } from '../implements/category.command';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler
  implements ICommandHandler<UpdateCategoryCommand>
{
  constructor(
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async execute(command: UpdateCategoryCommand): Promise<ProductCategory> {
    const { id, updateCategoryDto, file } = command;

    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (file) {
      let imageMedia = this.mediaRepository.create({
        url: `/uploads/categories/${file.filename}`,
        type: TypeMedia.CATEGORY_THUMBNAIL,
      });
      imageMedia = await this.mediaRepository.save(imageMedia);
      category.image_id = imageMedia.id;
    }

    Object.assign(category, updateCategoryDto);

    return await this.categoryRepository.save(category);
  }
}
