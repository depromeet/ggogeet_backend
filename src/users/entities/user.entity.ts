import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reminder } from '../../reminder/entities/reminder.entity';
import { Friend } from './friend.entity';
import { Social } from './social.entity';
import { UserInfo } from './userinfo.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  nickname: string;

  @Column({ type: 'varchar', length: 255 })
  profile_img: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToOne(() => Social, (social) => social.user)
  @JoinColumn()
  social: Social;

  @OneToOne(() => UserInfo, (userinfo) => userinfo.user)
  @JoinColumn()
  userinfo: UserInfo;

  @OneToMany(() => Friend, (friend) => friend.user)
  friends: Friend[];

  @OneToMany(() => Reminder, (reminder) => reminder.user)
  reminders: Reminder[];
}
