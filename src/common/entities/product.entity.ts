import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Brand } from './brand.entity';
import { Classify } from './classify.entity';
import { Media } from './media.entity';
import { ProductCategory } from './product-categories.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column({ type: 'varchar', length: 120, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'int', nullable: true })
  thumbnail_id: number;

  @OneToOne(() => Media)
  @JoinColumn({ name: 'thumbnail_id' })
  thumbnail: Media;

  @Column({ type: 'int', nullable: true })
  product_category_id: number;

  @ManyToOne(() => ProductCategory, (category) => category.products)
  @JoinColumn({ name: 'product_category_id' })
  category: ProductCategory;

  @Column({ type: 'int', nullable: true })
  brand_id: number;

  @ManyToOne(() => Brand, (brand) => brand.products)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Column({ type: 'int', nullable: true })
  classify_id: number;

  @ManyToOne(() => Classify, (classify) => classify.products)
  @JoinColumn({ name: 'classify_id' })
  classify: Classify;

  @Column({ type: 'int', nullable: true })
  origin_id: number;

  @OneToMany(() => Media, (media) => media.product)
  media: Media[];
}
