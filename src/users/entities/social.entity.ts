import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'social' })
export class Social {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  client_id: string;

  @Column({ default: false })
  allow_friends_list: boolean;
}
