import { b_, u_, v_ } from "@beetpx/beetpx";
import { Mode } from "../gameplay/Mode";
import { Score } from "../gameplay/Score";
import { c, g } from "../globals";

type TopbarParams = {
  score: Score;
  mode: Mode;
};

export class Topbar {
  readonly #score: Score;
  readonly #mode: Mode;

  constructor(params: TopbarParams) {
    this.#score = params.score;
    this.#mode = params.mode;
  }

  draw(): void {
    b_.rectFilled(g.cameraOffset, g.topbarSize, c.black);

    const modeLabel = this.#mode.label();
    if (modeLabel) {
      const textY = g.cameraOffset.y + 4;
      const modeLabelSize = u_.measureText(modeLabel);
      const progressW = modeLabelSize.x;
      const progressRemainingW = Math.floor(
        (this.#mode.percentageLeft() / 100) * progressW
      );
      const progressX = g.cameraOffset.x + g.screenSize.x - progressW - 1;
      const progressY = textY + modeLabelSize.y + 2;

      b_.print(modeLabel, v_(progressX, textY), c.lightGrey);

      if (progressRemainingW > 0) {
        b_.line(
          v_(progressX + progressW - progressRemainingW, progressY),
          v_(progressRemainingW, 1),
          this.#mode.progressColor()
        );
      }
    }

    b_.print(
      `score ${this.#score.value()}`,
      g.cameraOffset.add(v_(1, 4)),
      c.lightGrey
    );
  }
}
