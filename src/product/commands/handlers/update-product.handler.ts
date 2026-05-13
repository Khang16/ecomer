import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Inject, NotFoundException } from '@nestjs/common';
import { Product } from 'src/common/entities/product.entity';
import { Media } from 'src/common/entities/media.entity';
import { UpdateProductCommand } from '../implements/product.command';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async execute(command: UpdateProductCommand): Promise<Product> {
    const { id, updateProductDto } = command;

    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const { image_ids, video_ids, images, videos, ...productData } =
      updateProductDto as any;

    Object.assign(product, productData);
    const savedProduct = await this.productRepository.save(product);

    // Link images to product
    if (image_ids && image_ids.length > 0) {
      await this.mediaRepository.update(image_ids, { product: savedProduct });

      // Set the first image as thumbnail if not set
      if (!savedProduct.thumbnail_id) {
        savedProduct.thumbnail_id = image_ids[0];
        await this.productRepository.save(savedProduct);
      }
    }

    // Link videos to product
    if (video_ids && video_ids.length > 0) {
      await this.mediaRepository.update(video_ids, { product: savedProduct });
    }

    await this.cacheManager.set('products:list:version', Date.now());
    return savedProduct;
  }
}
