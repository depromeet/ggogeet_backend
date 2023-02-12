import { Test } from '@nestjs/testing';
import { SentenceService } from './sentence.service';
import { Sentence } from './entities/sentence.entity';
import { Repository } from 'typeorm';
import { SentenceController } from './sentence.controller';
import { User } from 'src/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SentenceResponseDto } from './dto/responses/sentence.response.dto';
import { NotFoundException } from '@nestjs/common';
import { CreateSentenceDto } from './dto/requests/createSentence.request.dto';
import { SentenceType } from 'src/constants/sentence.constant';

const mockRepository = () => ({
  save: jest.fn(),
  findAndCount: jest.fn().mockResolvedValueOnce([[Sentence], 1]),
  findOne: jest.fn().mockResolvedValue(Sentence),
  update: jest.fn(),
  softDelete: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('SentenceService', () => {
  let sentenceService: SentenceService;
  let sentenceRepository: MockRepository<Sentence>;
  const user = new User();
  user.id = 1;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SentenceController],
      providers: [
        SentenceService,
        {
          provide: 'SentenceRepository',
          useValue: mockRepository(),
        },
      ],
    }).compile();

    sentenceService = moduleRef.get<SentenceService>(SentenceService);
    sentenceRepository = moduleRef.get(getRepositoryToken(Sentence));
  });

  describe('FindOne', () => {
    const sentence = new Sentence();
    const sentenceResponseDto = new SentenceResponseDto(sentence);
    const id = 1;
    it('Find One if exist', () => {
      const result = sentenceService.findOne(user, id);
      expect(result).resolves.toEqual(sentenceResponseDto);
    });
    it('Can not find sentence', () => {
      jest.spyOn(sentenceRepository, 'findOne').mockResolvedValue(undefined);
      const result = sentenceService.findOne(user, id);
      expect(result).rejects.toThrowError(
        new NotFoundException({
          type: 'NOT_FOUND',
          message: `Sentence #1 not found`,
        }),
      );
    });
  });

  describe('create', () => {
    const sentenceDto: CreateSentenceDto = {
      content: 'test',
      isShared: false,
      situationId: 1,
    };
    const sentence: Sentence = {
      id: 1,
      situationId: 1,
      type: SentenceType.USER,
      content: 'test',
      userId: 1,
      isShared: false,
      myPreference: 0,
      totalPreference: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: user,
    };
    const sentenceResponseDto = new SentenceResponseDto(sentence);
    it('Create Sentence', () => {
      jest.spyOn(sentenceRepository, 'save').mockResolvedValue(sentence);
      const result = sentenceService.createSentence(user, sentenceDto);
      expect(result).resolves.toEqual(sentenceResponseDto);
    });
  });
});
