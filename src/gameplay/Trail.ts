import { SolidColor } from "beetpx";
import { Origin } from "./Origin";
import { Particle } from "./Particle";

type TrailParams = {
  origin: Origin;
  color: SolidColor;
};

export class Trail {
  readonly #origin: Origin;
  readonly #color: SolidColor;

  readonly #framesBetweenParticles = 4;
  #frameCounter = this.#framesBetweenParticles;

  #particles: Particle[] = [];

  constructor(params: TrailParams) {
    this.#origin = params.origin;
    this.#color = params.color;
  }

  update(): void {
    this.#particles.forEach((particle) => {
      particle.age();
    });
    this.#particles = this.#particles.filter(
      (particle) => !particle.shouldDisappear()
    );

    if (this.#frameCounter <= 0) {
      this.#particles.push(
        new Particle({
          xy: this.#origin.center(),
          color: this.#color,
        })
      );
    }
    this.#frameCounter =
      (this.#frameCounter + 1) % this.#framesBetweenParticles;
  }

  draw(): void {
    this.#particles.forEach((particle) => {
      particle.draw();
    });
  }
}
