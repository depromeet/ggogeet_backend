import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { NoticeService } from '../notice.service';
import { Notice } from '../entities/notice.entity';
import { NotFoundException } from '@nestjs/common';

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

describe('NoticeService', () => {
  let noticeService: NoticeService;
  let noticeRepository: Repository<Notice>;
  let notice: Notice;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        NoticeService,
        {
          provide: 'NoticeRepository',
          useFactory: mockRepository,
        },
      ],
    }).compile();

    noticeService = moduleRef.get<NoticeService>(NoticeService);
    noticeRepository = moduleRef.get<Repository<Notice>>('NoticeRepository');
    notice = new Notice();
  });

  describe('Test FindAll', () => {
    it('should return an array of notice', async () => {
      const result = [notice];
      jest
        .spyOn(noticeRepository, 'find')
        .mockImplementation(() => Promise.resolve(result));

      expect(await noticeService.findAll()).toBe(result);
    });
  });

  describe('Test FindOne', () => {
    it('should return a notice', async () => {
      jest
        .spyOn(noticeRepository, 'findOneBy')
        .mockImplementation(() => Promise.resolve(notice));

      expect(await noticeService.findOne(1)).toBe(notice);
    });
    it('If Notice Not Found', async () => {
      jest
        .spyOn(noticeRepository, 'findOneBy')
        .mockImplementation(() => Promise.resolve(undefined));

      await expect(noticeService.findOne(1)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('Test Create', () => {
    it('should create a notice', async () => {
      jest
        .spyOn(noticeRepository, 'save')
        .mockImplementation(() => Promise.resolve(notice));

      expect(await noticeService.create(notice)).toBe(notice);
    });
  });

  describe('Test Update', () => {
    it('should update a notice', async () => {
      jest
        .spyOn(noticeRepository, 'findOneBy')
        .mockImplementation(() => Promise.resolve(notice));
      jest
        .spyOn(noticeRepository, 'save')
        .mockImplementation(() => Promise.resolve(notice));

      expect(await noticeService.update(1, notice)).toBe(notice);
    });
    it('If Notice id Not Found', async () => {
      jest
        .spyOn(noticeRepository, 'findOneBy')
        .mockImplementation(() => Promise.resolve(undefined));

      await expect(noticeService.update(1, notice)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('Test Delete', () => {
    it('If Notice id Not Found', async () => {
      jest
        .spyOn(noticeRepository, 'findOneBy')
        .mockImplementation(() => Promise.resolve(undefined));

      await expect(noticeService.delete(1)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
