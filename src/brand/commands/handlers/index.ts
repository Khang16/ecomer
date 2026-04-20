import { CreateBrandHandler } from './create-brand.handler';
import { UpdateBrandHandler } from './update-brand.handler';
import { DeleteBrandHandler } from './delete-brand.handler';

export const BrandCommandHandlers = [
  CreateBrandHandler,
  UpdateBrandHandler,
  DeleteBrandHandler,
];
