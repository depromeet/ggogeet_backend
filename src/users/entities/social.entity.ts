import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('social')
export class Social {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'tinyint' })
  allow_friends: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
