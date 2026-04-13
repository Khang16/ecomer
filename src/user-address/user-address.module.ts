import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddress } from 'src/common/entities/user-address.entity';
import { Province } from 'src/common/entities/province.entity';
import { District } from 'src/common/entities/district.entity';
import { Ward } from 'src/common/entities/ward.entity';
import { UserAddressController } from './controllers/user-address.controller';
import { CommandHandler } from './commands/handlers';
import { QueryHandlers } from './queries/handlers';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([UserAddress, Province, District, Ward]),
  ],
  controllers: [UserAddressController],
  providers: [...CommandHandler, ...QueryHandlers],
})
export class UserAddressModule {}
