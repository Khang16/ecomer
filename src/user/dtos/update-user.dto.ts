import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './store-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
