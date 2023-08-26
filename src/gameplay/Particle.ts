import { BeetPx, SolidColor, v_, Vector2d } from "@beetpx/beetpx";

type ParticleParams = {
  xy: Vector2d;
  color: SolidColor;
};

export class Particle {
  readonly #xy: Vector2d;
  readonly #color: SolidColor;

  readonly #rMax = 2;
  readonly #ttlMax = 56;
  #ttl = this.#ttlMax;

  constructor(params: ParticleParams) {
    this.#xy = params.xy;
    this.#color = params.color;
  }

  age(): void {
    this.#ttl = Math.max(0, this.#ttl - 1);
  }

  shouldDisappear(): boolean {
    return this.#ttl <= 0;
  }

  draw(): void {
    const r = 0.5 + Math.floor((this.#ttl / this.#ttlMax) * (this.#rMax + 0.9));
    BeetPx.ellipseFilled(this.#xy.sub(r), v_(r, r).mul(2), this.#color);
  }
}
