import { b_, rgb_p8_, u_, v_ } from "@beetpx/beetpx";
import { Mode } from "../gameplay/Mode";
import { Score } from "../gameplay/Score";
import { g } from "../globals";

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
    b_.drawRectFilled(g.cameraOffset, g.topbarSize, rgb_p8_.black);

    const modeLabel = this.#mode.label();
    if (modeLabel) {
      const textY = g.cameraOffset.y + 4;
      const modeLabelSize = u_.measureText(modeLabel)[1];
      const progressW = modeLabelSize.x;
      const progressRemainingW = Math.floor(
        (this.#mode.percentageLeft() / 100) * progressW
      );
      const progressX = g.cameraOffset.x + g.screenSize.x - progressW - 1;
      const progressY = textY + modeLabelSize.y + 2;

      b_.drawText(modeLabel, v_(progressX, textY), rgb_p8_.silver);

      if (progressRemainingW > 0) {
        b_.drawLine(
          v_(progressX + progressW - progressRemainingW, progressY),
          v_(progressRemainingW, 1),
          this.#mode.progressColor()
        );
      }
    }

    b_.drawText(
      `score ${this.#score.value()}`,
      g.cameraOffset.add(v_(1, 4)),
      rgb_p8_.silver
    );
  }
}
