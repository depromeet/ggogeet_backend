export class TempLetterRepository {
  private static id = 0;
  private static store: Map<number, Map<number, Date>> = new Map();

  public save(id: number): number {
    const ttl = 3600 * 24 * 2;
    const timeOutDate = new Date(
      new Date().getTime() + ttl * 1000 * 60 * 60 * 24,
    );
    const timeAndId: Map<number, Date> = new Map();
    timeAndId.set(id, timeOutDate);
    TempLetterRepository.store.set(TempLetterRepository.id, timeAndId);
    TempLetterRepository.id++;
    return TempLetterRepository.id;
  }

  public findById(id: number): boolean {
    const result = TempLetterRepository.store.get(id);
    const k = result.keys()[0];
    if (k) {
      if (k.getTime() < new Date().getTime()) {
        TempLetterRepository.store.delete(id);
        return false;
      }
      return true;
    }
  }
}
