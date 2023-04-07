import { SentenceType } from 'src/constants/sentence.constant';
import { User } from 'src/domain/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sentence')
export class Sentence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: SentenceType, nullable: false })
  type: SentenceType;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @Column({ name: 'userId' })
  userId: number;

  @Column()
  content: string;

  @Column({ default: false })
  isShared: boolean;

  @Column({ nullable: true })
  myPreference: number;

  @Column({ nullable: true })
  totalPreference: number;

  @Column({ nullable: true })
  situationId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
