import { ApiProperty } from '@nestjs/swagger';
import { ReceivedLetter } from 'src/letter/entities/receivedLetter.entity';
import { SendLetter } from 'src/letter/entities/sendLetter.entity';

export class SendLetterDetailResponseDto {
  @ApiProperty({ example: 1, description: '보낸편지 id' })
  id: number;

  @ApiProperty({ example: '받는이', description: '받는사람 이름' })
  receiverNickname: string;

  @ApiProperty({ example: '2021-01-01 00:00:00', description: '언제 보냈는지' })
  sendAt: Date;

  @ApiProperty({ example: '받는이야 생일축하해~', description: '내용' })
  content: string;

  @ApiProperty({ example: 1, description: '상황 id' })
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
  @ApiProperty({ example: 1, description: '받은 편지 id' })
  id: number;

  @ApiProperty({ example: '보낸이', description: '보낸사람 이름' })
  senderNickname: string;

  @ApiProperty({ example: '2021-01-01 00:00:00', description: '언제 받았는지' })
  receivedAt: Date;

  @ApiProperty({ example: 'text OR image', description: '외부편지 추가 형식' })
  type: string;

  @ApiProperty({
    example: '파일 경로',
    description: '외부 이미지 편지의 이미지 주소',
  })
  imageContent: string;

  @ApiProperty({ example: '받는이야 생일축하해~', description: '내용' })
  content: string;

  @ApiProperty({ example: 1, description: '상황 id' })
  situationId: number;

  constructor(letter: ReceivedLetter) {
    this.id = letter.id;
    this.senderNickname = letter.senderNickname;
    this.receivedAt = letter.receivedAt;
    this.situationId = letter.letterBody.situationId;
    this.content = letter.letterBody.content;
    this.type = letter.letterBody.type;
    this.imageContent = letter.letterBody.imageContent;
  }
}

export class tempLetterResponseDto {
  @ApiProperty({
    example: 1,
    description: '보낸 편지 id (상대방이 보낼 때 저장하기 때문에)',
  })
  id: number;

  @ApiProperty({ example: '보낸이', description: '보낸사람 이름' })
  senderNickname: string;

  @ApiProperty({ example: '2021-01-01 00:00:00', description: '언제 받았는지' })
  receivedAt: Date;

  @ApiProperty({ example: '받는이야 생일축하해~', description: '내용' })
  content: string;

  @ApiProperty({ example: 1, description: '상황 id' })
  situationId: number;

  constructor(letter: SendLetter) {
    this.id = letter.id;
    this.senderNickname = letter.sender.nickname;
    this.receivedAt = letter.sendAt;
    this.situationId = letter.letterBody.situationId;
    this.content = letter.letterBody.content;
  }
}
