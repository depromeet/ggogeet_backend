import { Test } from '@nestjs/testing';
import { DeleteNoticeDto } from './dto/delete-notice.dto';
import { Notice } from './entities/notice.entity';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';

const mockRepository = () => ({});

describe('NoticeController', () => {
  let noticeController: NoticeController;
  let noticeService: NoticeService;
  let notice: Notice;
  let deleteNoticeDto: DeleteNoticeDto;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [NoticeController],
      providers: [
        NoticeService,
        {
          provide: 'NoticeRepository',
          useFactory: mockRepository,
        },
      ],
    }).compile();

    // add dependency of notice service

    noticeService = moduleRef.get<NoticeService>(NoticeService);
    noticeController = moduleRef.get<NoticeController>(NoticeController);
    notice = new Notice();
  });

  describe('Test FindAll', () => {
    it('should return an array of notice', async () => {
      const result = [notice];
      jest
        .spyOn(noticeService, 'findAll')
        .mockImplementation(() => Promise.resolve(result));

      expect(await noticeController.findAll()).toBe(result);
    });
  });

  describe('Test FindOne', () => {
    it('should return a notice', async () => {
      jest
        .spyOn(noticeService, 'findOne')
        .mockImplementation(() => Promise.resolve(notice));

      expect(await noticeController.findOne(1)).toBe(notice);
    });
  });

  describe('Test Create', () => {
    it('should create a notice', async () => {
      jest
        .spyOn(noticeService, 'create')
        .mockImplementation(() => Promise.resolve(notice));

      expect(await noticeController.create(notice)).toBe(notice);
    });
  });

  describe('Test Update', () => {
    it('should update a notice', async () => {
      jest
        .spyOn(noticeService, 'update')
        .mockImplementation(() => Promise.resolve(notice));

      expect(await noticeController.update(1, notice)).toBe(notice);
    });
  });

  describe('Test Remove', () => {
    it('should remove a notice', async () => {
      jest
        .spyOn(noticeService, 'delete')
        .mockImplementation(() => Promise.resolve(deleteNoticeDto));

      expect(await noticeController.delete(1)).toBe(undefined);
    });
  });
});
