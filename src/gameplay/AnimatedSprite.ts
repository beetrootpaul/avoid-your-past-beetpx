import { Sprite, xy_ } from "beetpx";
import { g } from "../globals";

type AnimatedSpriteParams = {
  firstSpriteSheetCell: number;
  numberOfSprites: number;
  framesPerSprite: number;
};

// TODO: sounds like something to be moved to the framework
export class AnimatedSprite {
  readonly #firstSpriteSheetCell: number;
  readonly #numberOfSprites: number;
  readonly #framesPerSprite: number;

  readonly #loopLengthFrames;
  #frameCounter;

  constructor(params: AnimatedSpriteParams) {
    this.#firstSpriteSheetCell = params.firstSpriteSheetCell;
    this.#numberOfSprites = params.numberOfSprites;
    this.#framesPerSprite = params.framesPerSprite;

    this.#loopLengthFrames = this.#framesPerSprite * this.#numberOfSprites;
    this.#frameCounter = 0;
  }

  advance1Frame(): void {
    this.#frameCounter = (this.#frameCounter + 1) % this.#loopLengthFrames;
  }

  currentSprite(): Sprite {
    let spriteIndex =
      this.#firstSpriteSheetCell +
      Math.floor(this.#frameCounter / this.#framesPerSprite);
    const spriteXy1 = xy_(
      spriteIndex % g.spriteSheetCells.x,
      Math.floor(spriteIndex / g.spriteSheetCells.x)
    ).mul(g.spriteSheetCellSize);
    return new Sprite(spriteXy1, spriteXy1.add(g.spriteSheetCellSize));
  }
}
