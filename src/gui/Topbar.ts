import { BeetPx, Utils, v_ } from "@beetpx/beetpx";
import { Mode } from "../gameplay/Mode";
import { Score } from "../gameplay/Score";
import { g, p8c } from "../globals";

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
    BeetPx.rectFilled(g.cameraOffset, g.topbarSize, p8c.black);

    const modeLabel = this.#mode.label();
    if (modeLabel) {
      const textY = g.cameraOffset.y + 4;
      const modeLabelSize = Utils.measureText(modeLabel);
      const progressW = modeLabelSize.x;
      const progressRemainingW = Math.floor(
        (this.#mode.percentageLeft() / 100) * progressW
      );
      const progressX = g.cameraOffset.x + g.screenSize.x - progressW - 1;
      const progressY = textY + modeLabelSize.y + 2;

      BeetPx.print(modeLabel, v_(progressX, textY), p8c.lightGrey);

      if (progressRemainingW > 0) {
        BeetPx.line(
          v_(progressX + progressW - progressRemainingW, progressY),
          v_(progressRemainingW, 1),
          this.#mode.progressColor()
        );
      }
    }

    BeetPx.print(
      `score ${this.#score.value()}`,
      g.cameraOffset.add(v_(1, 4)),
      p8c.lightGrey
    );
  }
}
