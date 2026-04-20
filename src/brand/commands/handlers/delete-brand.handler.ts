import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from 'src/common/entities/brand.entity';
import { DeleteBrandCommand } from '../implements/delete-brand.command';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(DeleteBrandCommand)
export class DeleteBrandHandler implements ICommandHandler<DeleteBrandCommand> {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async execute(command: DeleteBrandCommand): Promise<void> {
    const { id } = command;
    const brand = await this.brandRepository.findOne({ where: { id } });
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
    await this.brandRepository.remove(brand);
  }
}
