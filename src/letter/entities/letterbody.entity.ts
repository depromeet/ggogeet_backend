import { Reply } from 'src/reply/entities/reply.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @OneToOne(() => Reply)
  @JoinColumn()
  reply: Reply

  @Column({ type: "int" })
  relationship: number;
  
  @Column({ type: "int" })
  situation: number;
}
