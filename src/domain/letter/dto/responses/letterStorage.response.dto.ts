import { ApiProperty } from '@nestjs/swagger';
import { ReceivedLetter } from 'src/letter/entities/receivedLetter.entity';
import { SendLetter } from 'src/letter/entities/sendLetter.entity';

export class ReceviedAllResponseDto {
  @ApiProperty({ example: 1, description: '받은 편지 id' })
  id: number;
  @ApiProperty({ example: '보낸이', description: '보낸사람 이름' })
  senderNickname: string;
  @ApiProperty({ example: '2021-01-01 00:00:00', description: '언제 받았는지' })
  receivedAt: Date;
  @ApiProperty({ example: '생축', description: '편지 제목' })
  title: string;
  @ApiProperty({ example: 1, description: '상황 id' })
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
  @ApiProperty({ example: 1, description: '보낸편지 id' })
  id: number;
  @ApiProperty({ example: '받는이', description: '받는사람 이름' })
  receiverNickname: string;

  @ApiProperty({ example: '2021-01-01 00:00:00', description: '언제 보냈는지' })
  sendAt: Date;
  @ApiProperty({ example: '생축', description: '편지 제목' })
  title: string;

  @ApiProperty({ example: 1, description: '상황 id' })
  situationId: number;

  constructor(letter: SendLetter) {
    this.id = letter.id;
    this.receiverNickname = letter.receiverNickname;
    this.sendAt = letter.sendAt;
    this.situationId = letter.letterBody.situationId;
    this.title = letter.letterBody.title;
  }
}
