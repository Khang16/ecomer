import { CreateClassifyHandler } from './create-classify.handler';
import { UpdateClassifyHandler } from './update-classify.handler';
import { DeleteClassifyHandler } from './delete-classify.handler';

export const ClassifyCommandHandlers = [
  CreateClassifyHandler,
  UpdateClassifyHandler,
  DeleteClassifyHandler,
];
