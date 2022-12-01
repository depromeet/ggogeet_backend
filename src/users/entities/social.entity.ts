import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'social' })
export class Social {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  client_id: string;

  @Column({ nullable: true })
  allow_friends_list: boolean;
}
