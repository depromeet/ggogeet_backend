import { Sentence } from 'src/sentence/entities/sentence.entity';

export class SentenceResponseDto {
  id: number;
  situation_id: number;
  type: string;
  is_shared: boolean;
  created_at: Date;

  constructor(sentence: Sentence) {
    this.id = sentence.id;
    this.situation_id = sentence.situationId;
    this.is_shared = sentence.is_shared;
    this.type = sentence.type;
    this.created_at = sentence.created_at;
  }
}
