import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classify } from 'src/common/entities/classify.entity';
import { DeleteClassifyCommand } from '../implements/classify.command';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(DeleteClassifyCommand)
export class DeleteClassifyHandler
  implements ICommandHandler<DeleteClassifyCommand>
{
  constructor(
    @InjectRepository(Classify)
    private readonly classifyRepository: Repository<Classify>,
  ) {}

  async execute(command: DeleteClassifyCommand): Promise<void> {
    const { id } = command;
    const classify = await this.classifyRepository.findOne({ where: { id } });
    if (!classify) {
      throw new NotFoundException(`Classify with ID ${id} not found`);
    }
    await this.classifyRepository.remove(classify);
  }
}
