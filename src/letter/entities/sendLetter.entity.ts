import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
import { SendLetterStatus } from '../letter.constants';
import { LetterBody } from './letterbody.entity';
  
  @Entity('sendLetter')
  export class SendLetter {
    @PrimaryGeneratedColumn('increment')
    id: number;
  
    @ManyToOne(() => User)
    @JoinColumn({
      name: 'sender_id',
      referencedColumnName: 'id',
    })
    sender: User;
  
    @ManyToOne(() => User)
    @JoinColumn({
      name: 'receiver_id',
      referencedColumnName: 'id',
    })
    receiver: User;

    @Column({
        type: 'enum',
        enum: SendLetterStatus,
    })
    status: string
  
    @Column({ type: 'varchar', length: '255' })
    receiver_nickname: string;

    @OneToOne(() => LetterBody)
    @JoinColumn()
    letterbody: LetterBody;
  
    @CreateDateColumn()
    send_at: Date;

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  
    @DeleteDateColumn()
    deleted_at: Date;
  }
  