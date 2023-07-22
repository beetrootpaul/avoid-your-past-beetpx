import { Xy, xy_ } from "beetpx";
import { f, g, p8c } from "../globals";

type SashParams = {
  duration: number;
  expand: boolean;
  drawText: (sashCenter: Xy) => void;
};

export class Sash {
  readonly #ttlMax: number;

  readonly #shouldExpand: boolean;

  readonly #drawText: (sashCenter: Xy) => void;

  readonly #ttlExpansionStart: number;
  readonly #ttlExpansionEnd: number;
  readonly #ttlCollapseStart: number = g.musicBeatFrames / 4;
  #ttl: number;

  readonly #center = g.cameraOffset.add(g.screenSize.div(2));

  readonly #hMax = 30;

  constructor(params: SashParams) {
    this.#ttlMax = params.duration;
    this.#ttl = this.#ttlMax;

    this.#shouldExpand = params.expand;

    this.#drawText = params.drawText;

    this.#ttlExpansionStart = this.#shouldExpand
      ? this.#ttlMax - g.musicBeatFrames
      : this.#ttlMax;
    this.#ttlExpansionEnd = this.#shouldExpand
      ? this.#ttlExpansionStart - g.musicBeatFrames / 4
      : this.#ttlMax;
  }

  has_collapsed(): boolean {
    return this.#ttl <= 0;
  }

  hasExpanded(): boolean {
    return this.#ttl <= this.#ttlExpansionEnd;
  }

  collapse(): void {
    this.#ttl = this.#ttlCollapseStart;
  }

  advance1Frame(): void {
    this.#ttl -= 1;
  }

  draw(): void {
    let h: number;
    if (this.#ttl > this.#ttlExpansionStart) {
      h = 0;
    } else if (this.#ttl > this.#ttlExpansionEnd) {
      h =
        (this.#hMax * (this.#ttlExpansionStart - this.#ttl)) /
        (this.#ttlExpansionStart - this.#ttlExpansionEnd);
    } else if (this.#ttl > this.#ttlCollapseStart) {
      h = this.#hMax;
    } else {
      h = (this.#hMax * this.#ttl) / this.#ttlCollapseStart;
    }

    if (h > 0) {
      f.drawApi.rectFilled(
        xy_(0, this.#center.y - h / 2),
        xy_(g.screenSize.x, this.#center.y + h / 2),
        p8c.darkGreen
      );
    }

    if (h >= this.#hMax) {
      this.#drawText(this.#center);
    }
  }
}
