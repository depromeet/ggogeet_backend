import { ReceivedLetter } from 'src/letter/entities/receivedLetter.entity';
import { SendLetter } from 'src/letter/entities/sendLetter.entity';

export class SendLetterDetailResponseDto {
  id: number;
  receiverNickname: string;
  sendAt: Date;
  content: string;
  situationId: number;

  constructor(letter: SendLetter) {
    this.id = letter.id;
    this.receiverNickname = letter.receiverNickname;
    this.sendAt = letter.sendAt;
    this.situationId = letter.letterBody.situationId;
    this.content = letter.letterBody.content;
  }
}

export class ReceivedLetterDetailResponseDto {
  id: number;
  senderNickname: string;
  receivedAt: Date;
  type: string;
  content: string;
  situationId: number;

  constructor(letter: ReceivedLetter) {
    this.id = letter.id;
    this.senderNickname = letter.senderNickname;
    this.receivedAt = letter.receivedAt;
    this.situationId = letter.letterBody.situationId;
    this.content = letter.letterBody.content;
    this.type = letter.letterBody.type;
  }
}
