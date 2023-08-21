import { BeetPx, BpxSolidColor, BpxVector2d } from "beetpx";

type ParticleParams = {
  xy: BpxVector2d;
  color: BpxSolidColor;
};

export class Particle {
  readonly #xy: BpxVector2d;
  readonly #color: BpxSolidColor;

  readonly #rMax = 2;
  readonly #ttlMax = 14;
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
    BeetPx.ellipseFilled(this.#xy.sub(r), this.#xy.add(r), this.#color);
  }
}
