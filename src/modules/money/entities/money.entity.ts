import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('money')
export class Money {
  @PrimaryGeneratedColumn('uuid', { name: 'money_id' })
  moneyId: string;

  @Column({ type: 'varchar', name: 'user_id', nullable: false })
  userId: string;

  @Column({ type: 'varchar', name: 'piggy_bank_id', nullable: false })
  piggyBankId: string;

  @Column({ type: 'int', nullable: false })
  amount: number;

  // 0 未使用 1 已使用
  @Column({ type: 'int', default: 0, nullable: false })
  status: number;

  @Column({ type: 'datetime', name: 'deposit_time', nullable: true })
  depositTime: Date;

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
