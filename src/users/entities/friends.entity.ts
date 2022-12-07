import { timeStamp } from 'console';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'friend' })
export class Friends {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  kakao_uuid: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user_id: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'friend_user_id' })
  friend_user_id: User;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
