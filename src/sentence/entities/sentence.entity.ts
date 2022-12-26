import { SentenceType } from 'src/constants/sentence.constant';
import { Situation } from 'src/situation/entities/situation.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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

  @Column({ default: 0 })
  myPreference: number;

  @Column({ default: 0 })
  totalPreference: number;

  @ManyToOne(() => Situation)
  @JoinColumn({ name: 'situationId', referencedColumnName: 'id' })
  situation: Situation;

  @Column({ name: 'situationId' })
  situationId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
