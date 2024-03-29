import { b_, u_, v_ } from "@beetpx/beetpx";
import { Game } from "../Game";
import { Direction } from "../gameplay/Direction";
import { Level } from "../gameplay/Level";
import { Mode } from "../gameplay/Mode";
import { Player } from "../gameplay/Player";
import { Score } from "../gameplay/Score";
import { c, g } from "../globals";
import { Topbar } from "../gui/Topbar";
import { GameState } from "./GameState";
import { GameStateGameplay } from "./GameStateGameplay";

export class GameStateStart implements GameState {
  readonly #score = new Score();
  readonly #mode = new Mode();
  readonly #topbar = new Topbar({
    score: this.#score,
    mode: this.#mode,
  });
  readonly #player = new Player();
  readonly #level = new Level({
    mode: this.#mode,
    player: this.#player,
  });

  constructor() {
    b_.mutePlayback(Game.playbackIds.melody);
    b_.mutePlayback(Game.playbackIds.modeNoCoins);
    b_.mutePlayback(Game.playbackIds.modeNoMemories);

    this.#level.spawnItems();
  }

  update(): GameState {
    const detectedDirections: Direction[] = [];
    if (b_.wasButtonJustPressed("left")) detectedDirections.push("l");
    if (b_.wasButtonJustPressed("right")) detectedDirections.push("r");
    if (b_.wasButtonJustPressed("up")) detectedDirections.push("u");
    if (b_.wasButtonJustPressed("down")) detectedDirections.push("d");
    if (detectedDirections.length === 1) {
      detectedDirections.forEach(this.#player.direct.bind(this.#player));
    }

    if (detectedDirections.length === 1) {
      return new GameStateGameplay({
        mode: this.#mode,
        topbar: this.#topbar,
        score: this.#score,
        level: this.#level,
        player: this.#player,
      });
    }

    return this;
  }

  draw(): void {
    this.#level.drawBg();

    this.#level.drawItems();

    this.#player.draw();

    this.#topbar.draw();

    const margin = 6;
    const prompt1 = "press an arrow";
    const prompt2 = "to choose direction";
    const prompt1Size = u_.measureText(prompt1)[1];
    const prompt2Size = u_.measureText(prompt2)[1];
    u_.drawTextWithOutline(
      prompt1,
      v_(
        this.#player.center().x - prompt1Size.x / 2,
        this.#player.xy1().y - margin - 26
      ),
      c.lavender,
      c.darkBlue
    );
    u_.drawTextWithOutline(
      prompt2,
      v_(
        this.#player.center().x - prompt2Size.x / 2,
        this.#player.xy1().y - margin - 17
      ),
      c.lavender,
      c.darkBlue
    );
    const timeDependentBoolean = u_.booleanChangingEveryNthFrame(
      g.musicBeatFrames
    );
    const glyphColor = timeDependentBoolean ? c.blue : c.lavender;
    u_.drawTextWithOutline(
      "⬅️",
      v_(this.#player.xy1().x - margin - 8, this.#player.center().y - 2),
      glyphColor,
      c.darkBlue
    );
    u_.drawTextWithOutline(
      "➡️",
      v_(this.#player.xy2().x + margin + 2, this.#player.center().y - 2),
      glyphColor,
      c.darkBlue
    );
    u_.drawTextWithOutline(
      "⬆️",
      v_(this.#player.center().x - 3, this.#player.xy1().y - margin - 6),
      glyphColor,
      c.darkBlue
    );
    u_.drawTextWithOutline(
      "⬇️",
      v_(this.#player.center().x - 3, this.#player.xy2().y + margin + 2),
      glyphColor,
      c.darkBlue
    );
  }
}
