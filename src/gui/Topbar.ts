import { $d, $rgb_p8, $v } from "@beetpx/beetpx";
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
    $d.rectFilled(g.cameraOffset, g.topbarSize, $rgb_p8.black);

    const modeLabel = this.#mode.label();
    if (modeLabel) {
      const textY = g.cameraOffset.y + 4;
      const modeLabelSize = $d.measureText(modeLabel).wh;
      const progressW = modeLabelSize.x;
      const progressRemainingW = Math.floor(
        (this.#mode.percentageLeft() / 100) * progressW,
      );
      const progressX = g.cameraOffset.x + g.screenSize.x - progressW - 1;
      const progressY = textY + modeLabelSize.y + 2;

      $d.text(modeLabel, $v(progressX, textY), $rgb_p8.silver);

      if (progressRemainingW > 0) {
        $d.line(
          $v(progressX + progressW - progressRemainingW, progressY),
          $v(progressRemainingW, 1),
          this.#mode.progressColor(),
        );
      }
    }

    $d.text(
      `score ${this.#score.value()}`,
      g.cameraOffset.add($v(1, 4)),
      $rgb_p8.silver,
    );
  }
}
