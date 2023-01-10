import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { CreateDraftLetterDto } from './dto/requests/createDraftLetter.request.dto';
import { LetterBody } from './entities/letterBody.entity';
import { SendLetter } from './entities/sendLetter.entity';
import { SendLetterStatus } from './letter.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReceivedLetter } from './entities/receivedLetter.entity';
import { LetterUtils } from './letter.utils';
import { KakaoTokenRepository } from 'src/kakao/kakaoToken.memory.repository';
import { KakaoToken } from 'src/kakao/kakaoToken';
import { Friend } from 'src/friend/entities/friend.entity';
import { KakaoService } from 'src/kakao/kakao.service';
import { TempLetterRepository } from './repository/tempLetter.repository';
import { KakaoMessageCallbackDto } from './dto/requests/kakaoCallback.request.dto';

@Injectable()
export class LetterService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SendLetter)
    private sendLetterRepository: Repository<SendLetter>,
    @InjectRepository(ReceivedLetter)
    private receivedLetterRepository: Repository<ReceivedLetter>,
    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,
    private readonly kakaoService: KakaoService,
    private readonly kakaoTokenRepository: KakaoTokenRepository,
    private readonly tempLetterRepository: TempLetterRepository,
  ) {}

  async createDraftLetter(
    user: User,
    createDraftLetterDto: CreateDraftLetterDto,
  ): Promise<SendLetter> {
    /*
     * Check Recevier is Available
     * Save Letter Body(title, content, situationId)
     * Save Send Letter to Temporarily Saved
     */

    if (
      createDraftLetterDto?.receiverId == null &&
      createDraftLetterDto?.receiverNickname == null
    ) {
      throw new NotFoundException('Receiver is not available');
    }

    const receiver = createDraftLetterDto?.receiverId
      ? await this.userRepository.findOne({
          where: { id: createDraftLetterDto.receiverId },
        })
      : null;

    const receiverNickname = createDraftLetterDto?.receiverNickname
      ? createDraftLetterDto?.receiverNickname
      : receiver?.nickname;

    const letterBody = new LetterBody();
    letterBody.title = createDraftLetterDto.title;
    letterBody.content = createDraftLetterDto.content;
    letterBody.accessCode = LetterUtils.generateAccessCode();
    letterBody.situationId = createDraftLetterDto.situationId;

    const sendLetter = new SendLetter();
    sendLetter.sender = user;
    sendLetter.receiver = receiver;
    sendLetter.receiverNickname = receiverNickname;
    sendLetter.status = SendLetterStatus.TMP_SAVED;
    sendLetter.letterBody = letterBody;

    const result = await this.sendLetterRepository.save(sendLetter);
    return result;
  }

  async sendLetter(user: User, id: number): Promise<void> {
    /*
     * Validation of letter IDs and receiver
     * Get Access Token through Kakao API
     * Create new incoming letters, save sender information, and update the status of outgoing letters
     * Send Message to KaKaotalk Friends API
     */
    const sendLetter = await this.sendLetterRepository.findOne({
      where: { id: id, sender: { id: user.id } },
      relations: {
        receiver: true,
        sender: true,
        letterBody: true,
      },
    });

    if (!sendLetter) {
      throw new NotFoundException({
        statusCode: 400,
        message: 'There is no id',
        error: 'Bad Request to this Id, There is no id',
      });
    }
    if (sendLetter.receiver == null) {
      throw new NotFoundException({
        statusCode: 400,
        message: 'This Letter is not available',
        error: 'Bad Request to this Id, This Letter is not available',
      });
    }
    if (sendLetter.status == SendLetterStatus.SENT) {
      throw new NotFoundException({
        statusCode: 400,
        message: 'This Letter already sent',
        error: 'Bad Request to this Id, This Letter already sent',
      });
    }
    if (sendLetter.status == SendLetterStatus.SENT) {
      throw new NotFoundException({
        statusCode: 400,
        message: 'This Letter already sent',
        error: 'Bad Request to this Id, This Letter already sent',
      });
    }

    const kakaoToken: KakaoToken = await this.kakaoTokenRepository.findByUserId(
      user.id,
    );
    const acessToken = kakaoToken.getAcessToken();

    const friend = await this.friendRepository.findOne({
      where: {
        user: { id: user.id },
        friendUser: { id: sendLetter.receiver.id },
      },
    });

    if (!friend) {
      throw new NotFoundException({
        statusCode: 400,
        message: 'This Friend is not available',
        error: 'Bad Request to this Id, This Friend is not available',
      });
    }

    const kakaoUuid = friend.kakaoUuid;

    const receivedLetter = new ReceivedLetter();
    receivedLetter.sender = user;
    receivedLetter.receiver = sendLetter.receiver;
    receivedLetter.letterBody = sendLetter.letterBody;
    receivedLetter.senderNickname = sendLetter.sender.nickname;
    await this.receivedLetterRepository.save(receivedLetter);

    await this.sendLetterRepository.update(id, {
      status: SendLetterStatus.SENT,
    });

    const template_id = 87992;
    const template_args = `{\"letterId\": "${sendLetter.id}"}`;
    const result = this.kakaoService.sendKakaoMessage(
      acessToken,
      kakaoUuid,
      template_id,
      template_args,
    );
    return result;
  }

  async sendTempLetter(user: User, id: number): Promise<any> {
    const sendLetter = await this.sendLetterRepository.findOne({
      where: { id: id, sender: { id: user.id } },
      relations: {
        sender: true,
      },
    });

    if (!sendLetter) {
      throw new NotFoundException({
        statusCode: 400,
        message: 'There is no id',
        error: 'Bad Request to this Id, There is no id',
      });
    }
    if (sendLetter.receiverNickname == null) {
      throw new NotFoundException({
        statusCode: 400,
        message: 'There is no receiverNickname',
        error:
          'There is no receiverNickname, If you want to send this letter, please set receiverNickname',
      });
    }

    await this.tempLetterRepository.save(sendLetter.id);
    return {
      data: {
        tempLetterId: sendLetter.id,
        expiredDate: '2023-01-14',
      },
    };
  }

  async getKaKaoTempLetterCallback(query: KakaoMessageCallbackDto) {
    const letterId = parseInt(query.TEMP_LETTER_ID);
    const sendLetterId = await this.tempLetterRepository.save(letterId, true);
    return sendLetterId;
  }

  async getKaKaoTempLetterCallbackCheck(id: number) {
    const result = await this.tempLetterRepository.findById(id);
    return {
      data: {
        sent: result,
      },
    };
  }
}
