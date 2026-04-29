import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { PaymendMethod } from './payment-method.entity';

@Entity('order')
export class Order extends BaseEntity {
  @Column({ type: 'float', nullable: false })
  total_rice: number;

  @Column({ type: 'int', nullable: false })
  status: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  note: string;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', nullable: false })
  payment_method_id: number;

  @ManyToOne(() => PaymendMethod)
  @JoinColumn({ name: 'payment_method_id' })
  payment_methoa: PaymendMethod;
}
