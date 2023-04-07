import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';

export class TempLetterRepository {
  constructor(@InjectRedis('default') private readonly redis: Redis) {}
  private readonly ttl = 3600 * 24 * 3;

  async save(id: number, isSent = false): Promise<number> {
    const sentResult = isSent ? '1' : '0';
    const tempLetterKey = this.getTokenKey(id);
    await this.redis.set(tempLetterKey, sentResult, 'EX', this.ttl);
    return id;
  }

  async findById(id: number): Promise<boolean> {
    const tempLetterKey = this.getTokenKey(id);
    const result = await this.redis.get(tempLetterKey);
    if (result == '1') {
      return true;
    } else {
      return false;
    }
  }

  private getTokenKey(id: number): string {
    return `tempLetter:${id.toString()}`;
  }
}
