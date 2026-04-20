import { SetMetadata } from '@nestjs/common';
import { UserLevel } from 'src/common/enums/user/user.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserLevel[]) => SetMetadata(ROLES_KEY, roles);
