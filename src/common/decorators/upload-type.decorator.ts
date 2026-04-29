import { SetMetadata } from '@nestjs/common';
import { TypeMedia } from '../enums/media/type-media.enum';

export const MEDIA_TYPE_KEY = 'mediaType'; //key (tên) của metadata, Sau này bạn sẽ dùng key này để đọc lại giá trị
export const UploadType = (type: TypeMedia) =>
  SetMetadata(MEDIA_TYPE_KEY, type);
// UploadType là custom decorator
// Khi dùng, nó sẽ:
// Gắn metadata với key = 'mediaType'
// Value = type (IMAGE, VIDEO, PDF...)
//ustom decorator nhằm gắn metadata (thông tin bổ sung) lên route handler hoặc controller.
