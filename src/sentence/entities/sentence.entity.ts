import { SentenceType } from 'src/constants/sentence.constant';
import { Situation } from 'src/situation/entities/situation.entity';
import { User } from 'src/users/entities/user.entity';
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
