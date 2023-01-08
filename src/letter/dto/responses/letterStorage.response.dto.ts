import { ReceivedLetter } from 'src/letter/entities/receivedLetter.entity';
import { SendLetter } from 'src/letter/entities/sendLetter.entity';

export class ReceviedAllResponseDto {
  id: number;
  senderNickname: string;
  receivedAt: Date;
  title: string;
  situationId: number;

  constructor(letter: ReceivedLetter) {
    this.id = letter.id;
    this.senderNickname = letter.senderNickname;
    this.receivedAt = letter.receivedAt;
    this.situationId = letter.letterBody.situationId;
    this.title = letter.letterBody.title;
  }
}

export class SendAllResponseDto {
  id: number;
  receiverNickname: string;
  sendAt: Date;
  title: string;
  situationId: number;

  constructor(letter: SendLetter) {
    this.id = letter.id;
    this.receiverNickname = letter.receiverNickname;
    this.sendAt = letter.sendAt;
    this.situationId = letter.letterBody.situationId;
    this.title = letter.letterBody.title;
  }
}
