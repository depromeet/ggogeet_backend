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
import { User } from '../../users/entities/user.entity';
import { Situation } from 'src/situation/entities/situation.entity';

@Entity('reminder')
export class Reminder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'boolean' })
  alert_on: boolean;

  @Column({ type: 'boolean' })
  is_done: boolean;

  @Column({ type: 'timestamp' })
  alarm_at: Date;

  @Column({ type: 'timestamp' })
  event_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Situation)
  @JoinColumn({ name: 'situation_id' })
  situation: Situation;
}
