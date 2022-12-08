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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToOne(() => Social, { cascade: true })
  @JoinColumn({ name: 'social_id', referencedColumnName: 'id' })
  social: Social;

  @OneToOne(() => UserInfo, { cascade: true })
  @JoinColumn({ name: 'userinfo_id', referencedColumnName: 'id' })
  userinfo: UserInfo;
}
