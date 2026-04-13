import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';
import { DeleteUserCommand } from '../implements/delete-user.command';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: DeleteUserCommand): Promise<any> {
    const { id } = command;

    const user = await this.userRepository.findOne({ where: { id: +id } });

    if (!user) {
      throw new Error('User not found');
    }

    await this.userRepository.delete(user.id);

    return true;
  }
}
