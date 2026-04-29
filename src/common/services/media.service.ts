import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from 'src/common/entities/media.entity';
import { TypeMedia } from 'src/common/enums/media/type-media.enum';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async saveMedia(
    file: Express.Multer.File | undefined,
    type: TypeMedia,
    productId?: number,
  ): Promise<Media> {
    const folder = this.getFolderByType(type);
    const url = file 
      ? `/${folder}/${file.filename}` 
      : `/${folder}/${this.getDefaultImageName(type)}`;

    const media = this.mediaRepository.create({
      url: url,
      type: type,
      product: productId ? ({ id: productId } as any) : undefined,
    });
    return await this.mediaRepository.save(media);
  }

  private getDefaultImageName(type: TypeMedia): string {
    switch (type) {
      case TypeMedia.BRAND_THUMBNAIL: return 'brand-default.png';
      case TypeMedia.CATEGORY_THUMBNAIL: return 'category-default.png';
      case TypeMedia.CLASSIFY_THUMBNAIL: return 'classify-default.png';
      case TypeMedia.USER_AVATAR: return 'avatar-default.png';
      default: return 'product-default.png';
    }
  }

  async saveMultipleMedia(
    files: Express.Multer.File[],
    type: TypeMedia,
    productId?: number,
  ): Promise<Media[]> {
    return await Promise.all(
      files.map((file) => this.saveMedia(file, type, productId)),
    );
  }

  private getFolderByType(type: TypeMedia): string {
    switch (type) {
      case TypeMedia.BRAND_THUMBNAIL:
        return 'uploads/brands';
      case TypeMedia.CATEGORY_THUMBNAIL:
        return 'uploads/categories';
      case TypeMedia.CLASSIFY_THUMBNAIL:
        return 'uploads/classifies';
      case TypeMedia.USER_AVATAR:
        return 'uploads';
      case TypeMedia.PRODUCT_VIDEO:
        return 'uploads/videos';
      default:
        return 'uploads/products';
    }
  }
}
