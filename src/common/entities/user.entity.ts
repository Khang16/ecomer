import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Media } from './media.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 11, nullable: true })
  phone: string;

  @Column({ type: 'int', nullable: true })
  gender: number;

  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @Column({ type: 'int', nullable: false, default: 2 })
  is_confirmed: number;

  @Column({ type: 'int', nullable: true })
  otp: number;

  @Column({ type: 'int', nullable: false })
  level: number;

  @Column({ type: 'int', nullable: true })
  avatar_id: number;

  @OneToOne(() => Media)
  @JoinColumn({ name: 'avatar_id' })
  avatar: Media;
}
