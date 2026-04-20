import { CreateCategoryDto } from 'src/category/dto/create-category.dto';

export class CreateCategoryCommand {
  constructor(
    public readonly createCategoryDto: CreateCategoryDto,
    public readonly file?: Express.Multer.File,
  ) {}
}

export class UpdateCategoryCommand {
  constructor(
    public readonly id: number,
    public readonly updateCategoryDto: Partial<CreateCategoryDto>,
    public readonly file?: Express.Multer.File,
  ) {}
}

export class DeleteCategoryCommand {
  constructor(public readonly id: number) {}
}
