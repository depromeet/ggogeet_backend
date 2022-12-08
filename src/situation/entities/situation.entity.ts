import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('situation')
export class Situation {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text', nullable: true })
  content: string;
}
