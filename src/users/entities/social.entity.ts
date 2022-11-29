import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('social')
export class Social {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.social)
  user: User;

  @Column({ type: 'tinyint' })
  allow_friends: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
