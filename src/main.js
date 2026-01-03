import Boot from './scenes/Boot.js';
import Menu from './scenes/Menu.js';
import Game from './scenes/Game.js';
import GameOver from './scenes/GameOver.js';
import { ASPECT_RATIO, GAME_HEIGHT, GAME_WIDTH } from './utils/constants.js';

const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game-container',
  pixelArt: true,
  roundPixels: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [Boot, Menu, Game, GameOver],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

const game = new Phaser.Game(config);

const resize = () => {
  const { innerWidth, innerHeight } = window;
  const aspect = innerWidth / innerHeight;
  let width = innerWidth;
  let height = innerHeight;

  if (aspect > ASPECT_RATIO) {
    width = innerHeight * ASPECT_RATIO;
  } else {
    height = innerWidth / ASPECT_RATIO;
  }

  game.scale.resize(width, height);
};

window.addEventListener('resize', resize);
resize();
