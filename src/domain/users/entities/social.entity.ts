import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'social' })
export class Social {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clientId: string;

  @Column({ default: false })
  allowFriendsList: boolean;
}
