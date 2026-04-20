import { CreateBrandDto } from 'src/brand/dto/create-brand.dto';

export class UpdateBrandCommand {
  constructor(
    public readonly id: number,
    public readonly updateBrandDto: Partial<CreateBrandDto>,
    public readonly file?: Express.Multer.File,
  ) {}
}
