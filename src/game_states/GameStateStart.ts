import { $, $d, $rgb_p8, $u, $v } from "@beetpx/beetpx";
import { Game } from "../Game";
import { Direction } from "../gameplay/Direction";
import { Level } from "../gameplay/Level";
import { Mode } from "../gameplay/Mode";
import { Player } from "../gameplay/Player";
import { Score } from "../gameplay/Score";
import { g } from "../globals";
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
    $.mutePlayback(Game.playbackIds.melody);
    $.mutePlayback(Game.playbackIds.modeNoCoins);
    $.mutePlayback(Game.playbackIds.modeNoMemories);

    this.#level.spawnItems();
  }

  update(): GameState {
    const detectedDirections: Direction[] = [];
    if ($.wasButtonJustPressed("left")) detectedDirections.push("l");
    if ($.wasButtonJustPressed("right")) detectedDirections.push("r");
    if ($.wasButtonJustPressed("up")) detectedDirections.push("u");
    if ($.wasButtonJustPressed("down")) detectedDirections.push("d");
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
    const prompt1Size = $d.measureText(prompt1).wh;
    const prompt2Size = $d.measureText(prompt2).wh;
    $u.drawTextWithOutline(
      prompt1,
      $v(
        this.#player.center().x - prompt1Size.x / 2,
        this.#player.xy1().y - margin - 26,
      ),
      $rgb_p8.dusk,
      $rgb_p8.storm,
    );
    $u.drawTextWithOutline(
      prompt2,
      $v(
        this.#player.center().x - prompt2Size.x / 2,
        this.#player.xy1().y - margin - 17,
      ),
      $rgb_p8.dusk,
      $rgb_p8.storm,
    );
    const timeDependentBoolean = $u.booleanChangingEveryNthFrame(
      g.musicBeatFrames,
    );
    const glyphColor = timeDependentBoolean ? $rgb_p8.sky : $rgb_p8.dusk;
    $u.drawTextWithOutline(
      "⬅",
      $v(this.#player.xy1().x - margin - 8, this.#player.center().y - 2),
      glyphColor,
      $rgb_p8.storm,
    );
    $u.drawTextWithOutline(
      "➡",
      $v(this.#player.xy2().x + margin + 2, this.#player.center().y - 2),
      glyphColor,
      $rgb_p8.storm,
    );
    $u.drawTextWithOutline(
      "⬆",
      $v(this.#player.center().x - 3, this.#player.xy1().y - margin - 6),
      glyphColor,
      $rgb_p8.storm,
    );
    $u.drawTextWithOutline(
      "⬇",
      $v(this.#player.center().x - 3, this.#player.xy2().y + margin + 2),
      glyphColor,
      $rgb_p8.storm,
    );
  }
}
