import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
  
  @Entity('sendLetter')
  export class SendLetter {
    @PrimaryGeneratedColumn()
    id: number;
  
    // check
    @ManyToOne(() => User, (user) => user.reminders)
    sender: User;
    
    // check
    @ManyToOne(() => User, (user) => user.reminders)
    receiver: User;

    @Column({ type: 'varchar', length: 255 })
    status: string;
  
    @Column({ type: 'varchar', length: 255 })
    receiver_nickname: Date;
  
    @Column({ type: 'timestamp' })
    send_at: Date;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  
    @DeleteDateColumn()
    deleted_at: Date;
  
    // check
    // @OneToOne(() => User, (user) => user.social)
    // letterInfo: User;
  }
  