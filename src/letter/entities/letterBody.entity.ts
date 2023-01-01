import { Reply } from '../../reply/entities/reply.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LetterType } from '../letter.constants';

@Entity('letterBody')
export class LetterBody {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text', nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  resultImg: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  accessCode: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageContent: string;

  @Column({
    type: 'enum',
    enum: LetterType,
  })
  type: LetterType;

  @OneToOne(() => Reply, { cascade: true })
  @JoinColumn()
  reply: Reply;

  @Column({ type: 'int' })
  situationId: number;
}
