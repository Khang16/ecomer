import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from 'src/common/entities/media.entity';
import { User } from 'src/common/entities/user.entity';
import { CommandHandlers } from 'src/user/commands/handlers';
import { UserController } from './controllers/user.controller';
import { QueryHandlers } from './queries/handlers';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([User, Media])],
  controllers: [UserController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class UserModule {}
