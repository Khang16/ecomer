import { CreateUserAddressDto } from 'src/user-address/dtos/create-user-address.dto';

export class CreateUserAddressCommand {
  constructor(
    public readonly userId: number,
    public readonly createUserAddressDto: CreateUserAddressDto,
  ) {}
}
