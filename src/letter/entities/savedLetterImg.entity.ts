import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    // OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
  
  @Entity('savedLetterImg')
  export class SavedLetterImg {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, (user) => user.savedLetterImgs)
    user: User;
    
    @Column({ type: 'varchar', length: 255 })
    status: string;
  
    @Column({ type: 'varchar', length: 255 })
    attachedImg: string;

    @Column({ type: 'timestamp' })
    received_at: Date;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  
    @DeleteDateColumn()
    deleted_at: Date;
  }
  