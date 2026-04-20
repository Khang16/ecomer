import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/common/entities/product.entity';
import { Media } from 'src/common/entities/media.entity';
import { TypeMedia } from 'src/common/enums/media/type-media.enum';
import { UpdateProductCommand } from '../implements/product.command';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler
  implements ICommandHandler<UpdateProductCommand>
{
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async execute(command: UpdateProductCommand): Promise<Product> {
    const { id, updateProductDto, files } = command;

    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    Object.assign(product, updateProductDto);

    if (files.images && files.images.length > 0) {
      for (const file of files.images) {
        const media = this.mediaRepository.create({
          url: `/uploads/products/${file.filename}`,
          type: TypeMedia.PRODUCT_IMAGE_DETAIL,
          product: product,
        });
        await this.mediaRepository.save(media);
      }
    }

    if (files.videos && files.videos.length > 0) {
      for (const file of files.videos) {
        const media = this.mediaRepository.create({
          url: `/uploads/videos/${file.filename}`,
          type: TypeMedia.PRODUCT_VIDEO,
          product: product,
        });
        await this.mediaRepository.save(media);
      }
    }

    return await this.productRepository.save(product);
  }
}
