import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('provinces')
export class Province extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;
}
