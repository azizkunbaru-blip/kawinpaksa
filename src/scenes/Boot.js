import { BG_LAYER_KEYS, GROOM_TEXTURE_KEY, OBSTACLE_TYPES, PLAYER_TEXTURE_KEY } from '../utils/constants.js';

export default class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.image(PLAYER_TEXTURE_KEY, 'assets/sprites/bride.png');
    this.load.image(GROOM_TEXTURE_KEY, 'assets/sprites/groom.png');
    this.load.image(BG_LAYER_KEYS[0], 'assets/sprites/bg1.png');
    this.load.image(BG_LAYER_KEYS[1], 'assets/sprites/bg2.png');
    this.load.image(BG_LAYER_KEYS[2], 'assets/sprites/road.png');

    OBSTACLE_TYPES.forEach(({ key }) => {
      this.load.image(key, `assets/sprites/${key}.png`);
    });
  }

  create() {
    this.createFallbackTextures();
    this.scene.start('Menu');
  }

  createFallbackTextures() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });

    if (!this.textures.exists(PLAYER_TEXTURE_KEY)) {
      graphics.clear();
      graphics.fillStyle(0xffb6c1, 1);
      graphics.fillRect(0, 0, 28, 34);
      graphics.fillStyle(0xffffff, 1);
      graphics.fillRect(6, 4, 16, 10);
      graphics.generateTexture(PLAYER_TEXTURE_KEY, 28, 34);
    }

    if (!this.textures.exists(GROOM_TEXTURE_KEY)) {
      graphics.clear();
      graphics.fillStyle(0x8fd3ff, 1);
      graphics.fillRect(0, 0, 28, 34);
      graphics.fillStyle(0x2b2b2b, 1);
      graphics.fillRect(6, 4, 16, 10);
      graphics.generateTexture(GROOM_TEXTURE_KEY, 28, 34);
    }

    OBSTACLE_TYPES.forEach(({ key, width, height }) => {
      if (!this.textures.exists(key)) {
        graphics.clear();
        graphics.fillStyle(0xffa500, 1);
        graphics.fillRect(0, 0, width, height);
        graphics.fillStyle(0x2a2a2a, 1);
        graphics.fillRect(0, height - 6, width, 6);
        graphics.generateTexture(key, width, height);
      }
    });

    if (!this.textures.exists(BG_LAYER_KEYS[0])) {
      graphics.clear();
      graphics.fillStyle(0x1b1c3a, 1);
      graphics.fillRect(0, 0, 256, 144);
      graphics.fillStyle(0x2f3275, 1);
      for (let i = 0; i < 12; i += 1) {
        graphics.fillRect(12 + i * 20, 60, 12, 40 + (i % 3) * 10);
      }
      graphics.generateTexture(BG_LAYER_KEYS[0], 256, 144);
    }

    if (!this.textures.exists(BG_LAYER_KEYS[1])) {
      graphics.clear();
      graphics.fillStyle(0x2b2f4a, 1);
      graphics.fillRect(0, 0, 256, 144);
      graphics.fillStyle(0x3f4a85, 1);
      for (let i = 0; i < 10; i += 1) {
        graphics.fillRect(16 + i * 22, 70, 16, 50 + (i % 2) * 8);
      }
      graphics.generateTexture(BG_LAYER_KEYS[1], 256, 144);
    }

    if (!this.textures.exists(BG_LAYER_KEYS[2])) {
      graphics.clear();
      graphics.fillStyle(0x3b3b3b, 1);
      graphics.fillRect(0, 0, 256, 144);
      graphics.fillStyle(0x4f4f4f, 1);
      graphics.fillRect(0, 88, 256, 56);
      graphics.fillStyle(0x565656, 1);
      for (let i = 0; i < 8; i += 1) {
        graphics.fillRect(20 + i * 30, 102, 10, 6);
      }
      graphics.generateTexture(BG_LAYER_KEYS[2], 256, 144);
    }
  }
}
