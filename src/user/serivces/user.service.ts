import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { User } from 'src/common/entities/user.entity';
import { StoreUserCommand } from '../commands/implements/store-user.command';
import { CreateUserDto } from '../dtos/store-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly commandBus: CommandBus) {}

  store(dto: CreateUserDto, file: Express.Multer.File): Promise<User> {
    // Truyền cả DTO và File vào Command
    return this.commandBus.execute(new StoreUserCommand(dto, file));
  }
}
