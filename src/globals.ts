import { rgb_p8_, v_ } from "@beetpx/beetpx";

export const g = {
  // __quickStart: !__BEETPX_IS_PROD__,
  __quickStart: false,
  //
  screenSize: v_(128),
  cameraOffset: v_(0, -16),
  topbarSize: v_(128, 16),
  gameAreaSize: v_(128),
  tileSize: v_(8),
  //
  spriteSheetCells: v_(16),
  spriteSheetCellSize: v_(8),
  //
  musicBeatFrames: 16,
  //
  colors: {
    bgColorModeNormal: rgb_p8_.storm,
    bgColorModeNoCoins: rgb_p8_.orange,
    bgColorModeNoMemories: rgb_p8_.pink,
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
