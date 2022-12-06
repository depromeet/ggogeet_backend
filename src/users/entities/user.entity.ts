import { timeStamp } from 'console';
import { cp } from 'fs';
import { type } from 'os';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Social } from './social.entity';
import { UserInfo } from './userinfo.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  nickname: string;

  @Column()
  profile_img: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deleted_at: Date;

  @OneToOne(() => Social, {
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
    cascade: true,
  })
  @JoinColumn({ name: 'social_id', referencedColumnName: 'id' })
  social_id: Social;

  @OneToOne(() => UserInfo, {
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
    cascade: true,
  })
  @JoinColumn({ name: 'user_info_id', referencedColumnName: 'id' })
  user_info_id: UserInfo;
}
