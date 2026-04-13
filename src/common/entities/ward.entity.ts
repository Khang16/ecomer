import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Province } from './province.entity';
import { District } from './district.entity';

@Entity('wards')
export class Ward extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'int', nullable: false })
  province_id: number;

  @ManyToOne(() => Province)
  @JoinColumn({ name: 'province_id' })
  province: Province;

  @Column({ type: 'int', nullable: false })
  district_id: number;

  @ManyToOne(() => District)
  @JoinColumn({ name: 'district_id' })
  district: District;
}
