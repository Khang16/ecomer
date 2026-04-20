import { CreateClassifyDto } from 'src/classify/dto/create-classify.dto';

export class CreateClassifyCommand {
  constructor(
    public readonly createClassifyDto: CreateClassifyDto,
    public readonly file?: Express.Multer.File,
  ) {}
}

export class UpdateClassifyCommand {
  constructor(
    public readonly id: number,
    public readonly updateClassifyDto: Partial<CreateClassifyDto>,
    public readonly file?: Express.Multer.File,
  ) {}
}

export class DeleteClassifyCommand {
  constructor(public readonly id: number) {}
}
