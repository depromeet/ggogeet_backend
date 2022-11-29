import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  ETC = 'etc',
}

@Entity('userinfo')
export class UserInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'timestamp' })
  birthday: Date;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ type: 'tinyint' })
  remind_on: boolean;

  @Column({ type: 'tinyint' })
  alert_on: boolean;

  @Column({ type: 'tinyint' })
  welcome_popup_view: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => User, (user) => user.userinfo)
  user: User;
}
