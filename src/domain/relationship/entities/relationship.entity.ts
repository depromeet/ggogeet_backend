import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('relationship')
export class Relationship {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text', nullable: true })
  content: string;
}
