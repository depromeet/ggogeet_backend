import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    // ManyToOne,
    // OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
import { Reply } from '../../reply/entities/reply.entity';
  
  @Entity('letterInfo')
  export class LetterInfo {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'varchar', length: 255 })
    title: string;
    
    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'varchar', length: 255 })
    result_img: string;
  
    @Column({ type: 'varchar', length: 255 })
    template_url: string;
  
    @Column({ type: 'tinyint' })
    access_code: number;
  
    @OneToOne(() => Reply)
    @JoinColumn()
    reply: Reply;

    // @OneToOne(() => Relationship, (relationship) => relationship.letterInfo)
    // relationship: Relationship;

    // @OneToOne(() => Situation, (situation) => situation.letterInfo)
    // situation: Situation;

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  
    @DeleteDateColumn()
    deleted_at: Date;
  }
  