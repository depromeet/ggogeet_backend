export class TempLetterRepository {
  private static id = 0;
  private static store: Map<number, Date> = new Map();

  public save(): number {
    const ttl = 3600 * 24 * 2;
    const timeOutDate = new Date(
      new Date().getTime() + ttl * 1000 * 60 * 60 * 24,
    );
    TempLetterRepository.store.set(TempLetterRepository.id, timeOutDate);
    TempLetterRepository.id++;
    return TempLetterRepository.id;
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
