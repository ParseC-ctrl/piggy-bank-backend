import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('piggy_bank')
export class PiggyBank {
  @PrimaryGeneratedColumn('uuid', { name: 'piggy_bank_id' })
  piggyBankId: string;

  @Column({ type: 'varchar', name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', name: 'piggy_bank_name' })
  piggyBankName: string;

  @Column({ type: 'int', name: 'total', nullable: true, default: 0 })
  total: number;

  @Column({ type: 'int', name: 'target_amount', nullable: true })
  targetAmount: number;

  @Column({ type: 'int', name: 'expected_amount', nullable: true })
  expectedAmount: number;

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
