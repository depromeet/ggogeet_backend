import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Social } from './social.entity';
import { UserInfo } from './userInfo.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  nickname: string;

  @Column()
  profileImg: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => Social, { cascade: true })
  @JoinColumn({ name: 'socialId', referencedColumnName: 'id' })
  social: Social;

  @OneToOne(() => UserInfo, { cascade: true })
  @JoinColumn({ name: 'userInfoId', referencedColumnName: 'id' })
  userInfo: UserInfo;
}
