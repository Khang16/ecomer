import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserAddressCommand } from '../implements/create-user-address.command';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAddress } from 'src/common/entities/user-address.entity';
import { Repository } from 'typeorm';

@CommandHandler(CreateUserAddressCommand)
export class CreateUserAddressHandler implements ICommandHandler<CreateUserAddressCommand> {
  constructor(
    @InjectRepository(UserAddress)
    private readonly userAddressRepository: Repository<UserAddress>,
  ) {}

  async execute(command: CreateUserAddressCommand): Promise<any> {
    const { userId, createUserAddressDto } = command;

    const userAddress = this.userAddressRepository.create({
      name: createUserAddressDto.name,
      phone: createUserAddressDto.phone,
      type: createUserAddressDto.type,
      province_id: createUserAddressDto.province_id,
      district_id: createUserAddressDto.district_id,
      ward_id: createUserAddressDto.ward_id,
      user_id: userId,
    });

    return await this.userAddressRepository.save(userAddress);
  }
}
