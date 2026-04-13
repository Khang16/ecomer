import { DeleteUserHandler } from './delete-user.handler';
import { StoreUserHandler } from './store-user.handler';
import { UpdateUserHandler } from './update-user.handler';

export const CommandHandlers = [
  StoreUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
];
