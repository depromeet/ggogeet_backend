import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { LetterInfo } from './letterinfo.entity';

@Entity('receiveletter')
export class ReceiveLetter {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: User;

  @Column({ type: 'varchar', length: '255' })
  sender_nickname: string;

  @ManyToOne(() => LetterInfo)
  @JoinColumn({
    name: 'letterinfo_id',
    referencedColumnName: 'id',
  })
  letterinfo: LetterInfo;

  @CreateDateColumn()
  received_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
