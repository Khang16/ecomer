import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/common/entities/product.entity';
import { Media } from 'src/common/entities/media.entity';
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
    const { createProductDto } = command;

    const { image_ids, video_ids, images, videos, ...productData } = createProductDto;

    const product = this.productRepository.create(productData);
    const savedProduct = await this.productRepository.save(product);

    // Link images to product
    if (image_ids && image_ids.length > 0) {
      await this.mediaRepository.update(image_ids, { product: savedProduct });
      
      // Set the first image as thumbnail if not provided
      if (!savedProduct.thumbnail_id) {
          savedProduct.thumbnail_id = image_ids[0];
          await this.productRepository.save(savedProduct);
      }
    }

    // Link videos to product
    if (video_ids && video_ids.length > 0) {
      await this.mediaRepository.update(video_ids, { product: savedProduct });
    }

    return savedProduct;
  }
}
