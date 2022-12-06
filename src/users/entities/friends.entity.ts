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

@Entity({ name: 'friends' })
export class Friends {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user_id: User;

  @Column()
  kakao_uuid: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'friend_user_id' })
  friend_user_id: User;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
