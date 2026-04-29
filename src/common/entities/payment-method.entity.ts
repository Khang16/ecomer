import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('payment_method')
export class PaymendMethod extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string;
}
