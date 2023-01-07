export class TempLetterRepository {
  private static store: Map<number, Date> = new Map();

  public save(id: number, ttl: number): void {
    const timeOutDate = new Date(
      new Date().getTime() + ttl * 1000 * 60 * 60 * 24,
    );
    TempLetterRepository.store.set(id, timeOutDate);
  }

  public findById(id: number): boolean {
    const result = TempLetterRepository.store.get(id);
    if (result) {
      if (result.getTime() < new Date().getTime()) {
        TempLetterRepository.store.delete(id);
        return false;
      }
      return true;
    }
  }
}
