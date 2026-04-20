import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from '../common/entities/product.entity';
import { Media } from '../common/entities/media.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    imageFiles?: Array<Express.Multer.File>,
    videoFiles?: Array<Express.Multer.File>,
  ): Promise<Product> {
    const newProduct = this.productRepository.create({
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

    const savedProduct = await this.productRepository.save(newProduct);

    const allMedia: Media[] = [];

    // Xử lý lưu các file ảnh vừa upload (Type 1)
    if (imageFiles && imageFiles.length > 0) {
      const imageEntities = imageFiles.map((file) => {
        return this.mediaRepository.create({
          url: file.path.replace(/\\/g, '/'),
          type: 1, // 1 là Ảnh
          product: savedProduct,
        });
      });
      const savedImages = await this.mediaRepository.save(imageEntities);
      allMedia.push(...savedImages);
    }

    // Xử lý lưu các file video vừa upload (Type 2)
    if (videoFiles && videoFiles.length > 0) {
      const videoEntities = videoFiles.map((file) => {
        return this.mediaRepository.create({
          url: file.path.replace(/\\/g, '/'),
          type: 2, // 2 là Video
          product: savedProduct,
        });
      });
      const savedVideos = await this.mediaRepository.save(videoEntities);
      allMedia.push(...savedVideos);
    }

    if (allMedia.length > 0) {
      savedProduct.media = allMedia; // Gán media cho product
      await this.productRepository.save(savedProduct);
    }

    return savedProduct;
  }
}
