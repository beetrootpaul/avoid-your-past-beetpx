export class Score {
  #value = 0;

  value(): number {
    return this.#value;
  }

  public add(points: number): void {
    this.#value += points;
  }
}
