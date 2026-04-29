import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MediaService } from '../services/media.service';
import { Reflector } from '@nestjs/core';
import { TypeMedia } from '../enums/media/type-media.enum';
import { MEDIA_TYPE_KEY } from '../decorators/upload-type.decorator';

@Injectable()
export class MediaInterceptor implements NestInterceptor {
  constructor(
    private readonly mediaService: MediaService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const type = this.reflector.get<TypeMedia>(
      MEDIA_TYPE_KEY,
      context.getHandler(),
    );

    if (type === undefined) {
      return next.handle();
    }

    return from(this.processMedia(request, type)).pipe(
      switchMap(() => next.handle()),
    );
  }

  private validateFile(file: any, isVideo: boolean = false) {
    if (!file) return;

    if (isVideo) {
      // Video validation: MP4 only, max 50MB
      const allowedMimetypes = ['video/mp4'];
      if (!allowedMimetypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `Video ${file.originalname} is not supported. Only MP4 is allowed.`,
        );
      }
      if (file.size > 50 * 1024 * 1024) {
        throw new BadRequestException(
          `Video ${file.originalname} is too large. Max size is 50MB.`,
        );
      }
    } else {
      // Image/Document validation: PDF, JPG, WEBP, max 5MB
      // Note: JPG is image/jpeg
      const allowedMimetypes = [
        'image/jpeg',
        'image/webp',
        'application/pdf',
        'image/png',
      ];
      if (!allowedMimetypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `File ${file.originalname} is not supported. Allowed formats: PDF, JPG, WEBP.`,
        );
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new BadRequestException(
          `File ${file.originalname} is too large. Max size is 5MB.`,
        );
      }
    }
  }

  private async processMedia(request: any, type: TypeMedia): Promise<void> {
    // Handle single file (request.file) or default for POST
    if (request.file || (request.method === 'POST' && !request.files)) {
      if (request.file) {
        this.validateFile(request.file);
      }
      const media = await this.mediaService.saveMedia(request.file, type);

      const fieldName = request.file ? request.file.fieldname : 'image';
      if (fieldName === 'image' || fieldName === 'avatar') {
        request.body.image_id = media.id;
        request.body.avatar_id = media.id;
      }

      request.savedMedia = media;
      if (request.file) return;
    }

    // Handle multiple files (request.files)
    if (request.files) {
      if (Array.isArray(request.files)) {
        // Validate all files
        request.files.forEach((file: any) => this.validateFile(file));

        const savedMedia = await this.mediaService.saveMultipleMedia(
          request.files,
          type,
        );
        request.body.image_ids = savedMedia.map((m) => m.id);
        request.savedMedia = savedMedia;
      } else {
        const savedFields: any = {};
        for (const key in request.files) {
          const files = request.files[key];
          const isVideo = key === 'videos';

          // Validate all files in this field
          files.forEach((file: any) => this.validateFile(file, isVideo));

          let mediaType = type;
          if (isVideo) mediaType = TypeMedia.PRODUCT_VIDEO;

          const savedMedia = await this.mediaService.saveMultipleMedia(
            files,
            mediaType,
          );
          savedFields[key] = savedMedia;

          if (key === 'images')
            request.body.image_ids = savedMedia.map((m: any) => m.id);
          if (key === 'videos')
            request.body.video_ids = savedMedia.map((m: any) => m.id);
        }
        request.savedMedia = savedFields;
      }
    }
  }
}
