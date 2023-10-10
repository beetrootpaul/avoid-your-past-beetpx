import { v_ } from "@beetpx/beetpx";
import { Pico8Colors } from "./Pico8Color";

export const c = Pico8Colors;

export const g = {
  // __quickStart: !__BEETPX_IS_PROD__,
  __quickStart: false,
  //
  screenSize: v_(128, 128),
  cameraOffset: v_(0, -16),
  topbarSize: v_(128, 16),
  gameAreaSize: v_(128, 112),
  tileSize: v_(8, 8),
  //
  spriteSheetCells: v_(16, 16),
  spriteSheetCellSize: v_(8, 8),
  //
  musicBeatFrames: 16,
  //
  colors: {
    bgColorModeNormal: c.darkBlue,
    bgColorModeNoCoins: c.orange,
    bgColorModeNoMemories: c.pink,
  },
  //
  assets: {
    spritesheet: "spritesheet.png",
    pico8FontId: "pico8",
    pico8FontImage: "pico-8-font.png",
    coinSfx: "sfx_coin_collected.wav",
    musicBase: "music_base.wav",
    musicMelody: "music_melody.wav",
    musicModeNoCoins: "mode_no_coins.wav",
    musicModeNoMemories: "mode_no_memories.wav",
  } as const,
};
