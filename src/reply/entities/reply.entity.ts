import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity('reply')
  export class Reply {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ type: 'text' })
    content: string;

    @CreateDateColumn()
    created_at: Date;
  
    @DeleteDateColumn()
    deleted_at: Date;
  }
  