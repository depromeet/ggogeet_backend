import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { LetterType } from '../letter.constants';

@Entity('letterbody')
export class LetterBody {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text', nullable: true })
  title: LetterType;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  result_img: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  template_url: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  access_code: string;

//   reply: Reply
// relationship
// situation
}
