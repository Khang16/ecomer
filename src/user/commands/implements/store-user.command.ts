import { CreateUserDto } from 'src/user/dtos/store-user.dto';

export class StoreUserCommand {
  constructor(
    public readonly createUserDto: CreateUserDto,
    public readonly file?: Express.Multer.File,
  ) {}
}
