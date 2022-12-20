import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SendLetterStatus } from '../letter.constants';
import { LetterBody } from './letterBody.entity';

@Entity('sendLetter')
export class SendLetter {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'senderId',
    referencedColumnName: 'id',
  })
  sender: User;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'receiverId',
    referencedColumnName: 'id',
  })
  receiver: User;

  @Column({
    type: 'enum',
    enum: SendLetterStatus,
  })
  status: string;

  @Column({ type: 'varchar', length: '255' })
  receiverNickname: string;

  @OneToOne(() => LetterBody, { cascade: true })
  @JoinColumn()
  letterBody: LetterBody;

  @CreateDateColumn()
  sendAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
