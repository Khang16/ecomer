import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/common/entities/product.entity';
import { Media } from 'src/common/entities/media.entity';
import { TypeMedia } from 'src/common/enums/media/type-media.enum';
import { CreateProductCommand } from '../implements/product.command';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async execute(command: CreateProductCommand): Promise<Product> {
    const { createProductDto, files } = command;

    const product = this.productRepository.create({
      name: createProductDto.name,
      description: createProductDto.description,
      quantity: createProductDto.quantity,
      price: createProductDto.price,
      thumbnail_id: createProductDto.thumbnail_id,
      product_category_id: createProductDto.product_category_id,
      brand_id: createProductDto.brand_id,
      classify_id: createProductDto.classify_id,
      origin_id: createProductDto.origin_id,
    });
    const savedProduct = await this.productRepository.save(product);

    // Handle images
    if (files.images && files.images.length > 0) {
      for (let i = 0; i < files.images.length; i++) {
        const file = files.images[i];
        const media = this.mediaRepository.create({
          url: `/uploads/products/${file.filename}`,
          type:
            i === 0
              ? TypeMedia.PRODUCT_THUMBNAIL_CATEGORY
              : TypeMedia.PRODUCT_IMAGE_DETAIL,
          product: savedProduct,
        });
        const savedMedia = await this.mediaRepository.save(media);
        // Set the first image as thumbnail
        if (i === 0) {
          savedProduct.thumbnail_id = savedMedia.id;
          await this.productRepository.save(savedProduct);
        }
      }
    } else {
      // Default thumbnail if no images uploaded
      const media = this.mediaRepository.create({
        url: `/uploads/products/product-default.png`,
        type: TypeMedia.PRODUCT_THUMBNAIL_CATEGORY,
      });
      const savedMedia = await this.mediaRepository.save(media);
      savedProduct.thumbnail_id = savedMedia.id;
      await this.productRepository.save(savedProduct);
    }

    // Handle videos
    if (files.videos && files.videos.length > 0) {
      for (const file of files.videos) {
        const media = this.mediaRepository.create({
          url: `/uploads/videos/${file.filename}`,
          type: TypeMedia.PRODUCT_VIDEO,
          product: savedProduct,
        });
        await this.mediaRepository.save(media);
      }
    }

    return savedProduct;
  }
}
