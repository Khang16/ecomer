import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Product } from './product.entity';

@Entity('media')
export class Media extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  url: string;

  @Column({ type: 'int', nullable: false })
  type: number;

  @ManyToOne(() => Product, (product) => product.media)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
