import { type } from 'os';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'userinfo' })
export class UserInfo {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  birthday: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ default: true })
  remind_yn: boolean;

  @Column({ default: true })
  alert_yn: boolean;

  @Column({ default: false })
  welcome_popup: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
