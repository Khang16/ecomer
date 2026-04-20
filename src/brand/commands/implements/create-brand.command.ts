import { CreateBrandDto } from '../../dto/create-brand.dto';

export class CreateBrandCommand {
  constructor(
    public readonly createBrandDto: CreateBrandDto,
    public readonly file?: Express.Multer.File,
  ) {}
}
