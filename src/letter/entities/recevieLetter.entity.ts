import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    // OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
  
  @Entity('recevieLetter')
  export class RecevieLetter {
    @PrimaryGeneratedColumn()
    id: number;
  
    // check
    @OneToMany(() => User, (user) => user.recevieLetters)
    sender: User;
    
    // check
    @OneToMany(() => User, (user) => user.receivers)
    receiver: User;

    @Column({ type: 'varchar', length: 255 })
    status: string;
  
    @Column({ type: 'timestamp' })
    received_at: Date;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  
    @DeleteDateColumn()
    deleted_at: Date;
  }
  