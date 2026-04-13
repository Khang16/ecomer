import { FilterUserDto } from 'src/user/dtos/filter-user.dto';

export class GetUsersQuery {
  constructor(public readonly filter: FilterUserDto) {}
}
