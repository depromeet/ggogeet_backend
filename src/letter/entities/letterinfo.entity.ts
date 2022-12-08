import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { LetterType } from '../letter.constants';

@Entity('letterinfo')
export class LetterInfo {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'enum', enum: LetterType, nullable: false })
  type: LetterType;

  // Q: 이거 빼는거겠죠?
  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image_url: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  template_url: string;
}
