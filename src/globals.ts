import { $rgb_p8, $v } from "@beetpx/beetpx";

export const g = {
  __quickStart: !window.BEETPX__IS_PROD,
  //
  screenSize: $v(128),
  cameraOffset: $v(0, -16),
  topbarSize: $v(128, 16),
  gameAreaSize: $v(128, 112),
  tileSize: $v(8),
  //
  spriteSheetCells: $v(16),
  spriteSheetCellSize: $v(8),
  //
  musicBeatFrames: 16,
  //
  colors: {
    bgColorModeNormal: $rgb_p8.storm,
    bgColorModeNoCoins: $rgb_p8.orange,
    bgColorModeNoMemories: $rgb_p8.pink,
  },
  //
  assets: {
    spritesheet: "spritesheet.png",
    coinSfx: "sfx_coin_collected.wav",
    musicBase: "music_base.wav",
    musicMelody: "music_melody.wav",
    musicModeNoCoins: "mode_no_coins.wav",
    musicModeNoMemories: "mode_no_memories.wav",
  } as const,
};
