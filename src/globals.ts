import { PocTsBGFramework, Utils, xy_ } from "beetpx";
import { Pico8Colors } from "./Pico8Color";

export const f = PocTsBGFramework;

export const p8c = Pico8Colors;

export const u = Utils;

export const g = {
  // TODO: make it always false for prod build
  __debug: true,
  __quickStart: false,
  //
  fps: 30,
  //
  screenSize: xy_(128, 128),
  cameraOffset: xy_(0, -16),
  topbarSize: xy_(128, 16),
  gameAreaSize: xy_(128, 112),
  tileSize: xy_(8, 8),
  //
  spriteSheetCells: xy_(16, 16),
  spriteSheetCellSize: xy_(8, 8),
  //
  musicBeatFrames: 16,
  //
  colors: {
    bgColorModeNormal: p8c.darkBlue,
    bgColorModeNoCoins: p8c.orange,
    bgColorModeNoMemories: p8c.pink,
  },
  //
  assets: {
    spritesheet: "spritesheet.png",
    pico8Font: "pico-8-font.png",
    coinSfx: "sfx_coin_collected.wav",
    musicBase: "music_base.wav",
    musicMelody: "music_melody.wav",
    musicModeNoCoins: "mode_no_coins.wav",
    musicModeNoMemories: "mode_no_memories.wav",
  } as const,
};
