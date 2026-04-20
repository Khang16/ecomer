import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Product } from './product.entity';
import { Media } from './media.entity';

@Entity('product_categories')
export class ProductCategory extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', nullable: true })
  image_id: number;

  @OneToOne(() => Media)
  @JoinColumn({ name: 'image_id' })
  image: Media;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
