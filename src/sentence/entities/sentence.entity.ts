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
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  content: string;

  @Column({ default: false })
  is_shared: boolean;

  @Column({ default: 0 })
  my_preference: number;

  @Column({ default: 0 })
  total_preference: number;

  @ManyToOne(() => Situation)
  @JoinColumn({ name: 'situation_id', referencedColumnName: 'id' })
  situation: Situation;

  @Column({ name: 'situation_id' })
  situationId: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
