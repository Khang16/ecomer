import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('media')
export class Media extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  url: string;

  @Column({ type: 'int', nullable: false })
  type: number;
}
