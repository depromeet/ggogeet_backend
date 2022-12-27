import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { CreateDraftLetterDto } from './dto/requests/createDraftLetter.request.dto';
import { LetterBody } from './entities/letterBody.entity';
import { SendLetter } from './entities/sendLetter.entity';
import { SendLetterStatus } from './letter.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SendLetterDto } from './dto/requests/sendLetter.request.dto';
import { CallbackType } from 'src/constants/kakaoCallback.constant';
import { AuthService } from 'src/auth/auth.service';
import { ReceivedLetter } from './entities/receivedLetter.entity';

@Injectable()
export class LetterService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SendLetter)
    private sendLetterRepository: Repository<SendLetter>,
    @InjectRepository(ReceivedLetter)
    private receivedLetterRepository: Repository<ReceivedLetter>,
    private readonly authService: AuthService,
  ) {}

  async createDraftLetter(
    user: User,
    createDraftLetterDto: CreateDraftLetterDto,
  ) {
    /*
     * Check Recevier is Available
     * Save Letter Body(title, content, template url, situation)
     * Save Send Letter to Temporarily Saved
     */

    const receiver = createDraftLetterDto?.receiverId
      ? await this.userRepository.findOne({
          where: { id: createDraftLetterDto.receiverId },
        })
      : null;

    const letterBody = new LetterBody();
    letterBody.title = createDraftLetterDto.title;
    letterBody.content = createDraftLetterDto.content;
    letterBody.templateUrl = createDraftLetterDto.templateUrl;
    letterBody.accessCode = 'should_generate_random_code';
    letterBody.situationId = createDraftLetterDto.situationId;

    const sendLetter = new SendLetter();
    sendLetter.sender = user;
    sendLetter.receiver = receiver;
    sendLetter.receiverNickname = createDraftLetterDto.receiverNickname;
    sendLetter.status = SendLetterStatus.TMP_SAVED;
    sendLetter.letterBody = letterBody;

    const result = await this.sendLetterRepository.save(sendLetter);
    return result;
  }

  async sendLetter(user: User, id: number, sendLetterDto: SendLetterDto) {
    /*
     * Validation of letter IDs and recevier
     * Get Access Token through Kakao API
     * Create new incoming letters, save sender information, and update the status of outgoing letters
     * Send Message to KaKaotalk Friends API
     */
    const sendLetter = await this.sendLetterRepository.findOne({
      where: { id: id, sender: { id: user.id } },
    });
    if (!sendLetter) {
      throw new NotFoundException('There is no id');
    }
    if (sendLetter.receiver == null) {
      throw new NotFoundException('There is no receiver');
    }

    const codeResponse = await this.authService.getKakaoAccessToken(
      sendLetterDto.kakaoAccessCode,
      CallbackType.FRIEND,
    );

    const receivedLetter = new ReceivedLetter();
    receivedLetter.sender = user;
    receivedLetter.receiver = sendLetter.receiver;
    receivedLetter.letterBody = sendLetter.letterBody;
    receivedLetter.senderNickname = sendLetter.sender.nickname;
    await this.receivedLetterRepository.save(receivedLetter);

    await this.sendLetterRepository.update(id, {
      status: SendLetterStatus.SENT,
    });

    await this.authService.sendMessageToUser(
      codeResponse.access_token,
      sendLetterDto.kakaoUuid,
    );
  }
}
