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

  @Column({ nullable: true })
  remind_yn: boolean;

  @Column({ nullable: true })
  alert_yn: boolean;

  @Column({ nullable: true })
  welcome_popup: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
