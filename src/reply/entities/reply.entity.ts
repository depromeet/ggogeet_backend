import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reply')
export class Reply {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text', nullable: true })
  content: string;
}
