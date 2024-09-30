import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId: string;

  @Column({ type: 'int', nullable: true })
  gender: number;

  @Column({ type: 'varchar', nullable: true })
  avatar: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  nickname: string;

  @Column({ type: 'varchar', nullable: true })
  password: string;

  @CreateDateColumn({
    name: 'create_time',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    precision: 0,
  })
  createTime: Date;

  @UpdateDateColumn({
    name: 'update_time',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    precision: 0,
  })
  updateTime: Date;
}
