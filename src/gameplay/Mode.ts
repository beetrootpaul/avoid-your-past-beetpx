import { CompositeColor, FillPattern, SolidColor } from "beetpx";
import { g } from "../globals";

export class Mode {
  #current: "regular" | "no_coins" | "no_memories" = "regular";

  #ttl = 0;

  #ttlMax(): number {
    switch (this.#current) {
      case "no_coins":
        return 90;
      case "no_memories":
        return 150;
      default:
        // Any value, safe to use as in divisions. In theory, this code won't be reached.
        return 1;
    }
  }

  isNoCoins(): boolean {
    return this.#current === "no_coins";
  }

  isNoMemories(): boolean {
    return this.#current === "no_memories";
  }

  startNoCoins(): void {
    this.#current = "no_coins";
    this.#ttl = this.#ttlMax();
  }

  startNoMemories(): void {
    this.#current = "no_memories";
    this.#ttl = this.#ttlMax();
  }

  label(): string | null {
    switch (this.#current) {
      case "no_coins":
        return "cannot collect coins";
      case "no_memories":
        return "invulnerable";
      default:
        return null;
    }
  }

  progressColor(): SolidColor {
    switch (this.#current) {
      case "no_coins":
        return g.colors.bgColorModeNoCoins;
      case "no_memories":
        return g.colors.bgColorModeNoMemories;
      default:
        return g.colors.bgColorModeNormal;
    }
  }

  bgColor(): SolidColor | CompositeColor {
    switch (this.#current) {
      case "no_coins":
        return new CompositeColor(
          g.colors.bgColorModeNoCoins,
          g.colors.bgColorModeNormal
        );
      case "no_memories":
        return new CompositeColor(
          g.colors.bgColorModeNoMemories,
          g.colors.bgColorModeNormal
        );
      default:
        return g.colors.bgColorModeNormal;
    }
  }

  bgPattern(): FillPattern {
    if (this.#current == "regular") {
      return FillPattern.primaryOnly;
    }

    const ttlMax = this.#ttlMax();
    let ttlDistanceFromStartToEnd = Math.min(this.#ttl, ttlMax - this.#ttl);

    switch (ttlDistanceFromStartToEnd) {
      case 0:
        return FillPattern.of(0b1111_1111_1011_1111);
      case 1:
        return FillPattern.of(0b1010_1111_1010_1111);
      case 2:
        return FillPattern.of(0b1010_0101_1010_0101);
      case 3:
        return FillPattern.of(0b0000_0101_0000_0101);
      case 4:
        return FillPattern.of(0b0000_0000_0000_0001);
      default:
        return FillPattern.primaryOnly;
    }
  }

  percentageLeft(): number {
    switch (this.#current) {
      case "no_coins":
        return (100 * this.#ttl) / this.#ttlMax();
      case "no_memories":
        return (100 * this.#ttl) / this.#ttlMax();
      default:
        return 0;
    }
  }

  update(callbacks: { onBackToRegularMode: () => void }): void {
    if (this.#current != "regular" && this.#ttl <= 0) {
      this.#current = "regular";
      callbacks.onBackToRegularMode();
    }
    if (this.#ttl > 0) {
      this.#ttl -= 1;
    }
  }
}
