import { BpxSolidColor, BpxVector2d, b_, v_ } from "@beetpx/beetpx";

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
    // This `r` is not really a radius since we add 1 to the diameter when drawing an ellipse.
    //   Why? With let's say radius of 2.5 (to have an ellipse of size 5) we was ending up
    //   with ellipse's y1 being 0.5 more than player sprite's y1. Which resulted with rounding
    //   either making ellipse drawn 1 px lower than the player (as intended) or at the same y
    //  (e.g. player's y = 10.5 -> 11 and ellipse's = 11.0 -> 11).
    const r = Math.floor((this.#ttl / this.#ttlMax) * (this.#rMax + 0.9));
    const d = r * 2 + 1;
    b_.ellipseFilled(this.#xy.sub(r), v_(d, d), this.#color);
  }
}
