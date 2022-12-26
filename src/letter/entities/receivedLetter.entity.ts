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

@Entity('receivedLetter')
export class ReceivedLetter {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'receiverId',
    referencedColumnName: 'id',
  })
  receiver: User;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'senderId',
    referencedColumnName: 'id',
  })
  sender: User;

  @Column({ type: 'varchar', length: '255' })
  senderNickname: string;

  // 필요한가? createdAt 으로 쓰면 될듯한데
  @CreateDateColumn()
  receivedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}