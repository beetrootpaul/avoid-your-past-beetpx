import { $rgb_p8 } from "@beetpx/beetpx";
import { Collisions } from "../Collisions";
import { Memory } from "./Memory";
import { Player } from "./Player";
import { Trail } from "./Trail";

type MemoriesParams = {
  player: Player;
};

export class Memories {
  readonly #player: Player;

  readonly #memoriesFromFirstToLast: Memory[] = [];
  readonly #trails: Trail[] = [];

  constructor(params: MemoriesParams) {
    this.#player = params.player;
  }

  addMemory(): void {
    const memory = new Memory({
      origin:
        this.#memoriesFromFirstToLast.length > 0 ?
          this.#memoriesFromFirstToLast[
            this.#memoriesFromFirstToLast.length - 1
          ]!
        : this.#player,
    });

    this.#memoriesFromFirstToLast.push(memory);

    this.#trails.push(
      new Trail({
        origin: memory,
        color: $rgb_p8.wine,
      }),
    );
  }

  move(): void {
    this.#trails.forEach(trail => {
      trail.update();
    });
    this.#memoriesFromFirstToLast.forEach(memory => {
      memory.followOrigin();
    });
  }

  hasPlayerCollidedWithMemory(): boolean {
    return this.#memoriesFromFirstToLast.some(
      memory =>
        memory.isActive() &&
        Collisions.haveCirclesCollided(
          this.#player.collisionCircle(),
          memory.collisionCircle(),
        ),
    );
  }

  draw(opts: { noMemoriesModeFramesLeft: number }): void {
    if (opts.noMemoriesModeFramesLeft <= 0) {
      this.#trails.forEach(trail => {
        trail.draw();
      });
    }

    this.#memoriesFromFirstToLast.forEach(memory => {
      memory.draw(opts);
    });
  }
}
