import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('friend')
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  kakao_uuid: string;

  // @요기 어떻게할까요 유저와 친구 쌍 메니투메니인거같기도 하네요
  @Column({ type: 'varchar', length: 255 })
  friend_user_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.friends)
  user: User;
}
