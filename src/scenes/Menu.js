import { GAME_HEIGHT, GAME_WIDTH } from '../utils/constants.js';

export default class Menu extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    const { width, height } = this.scale;
    const title = this.add.text(width / 2, height * 0.28, 'KAWIN PAKSA', {
      fontFamily: 'monospace',
      fontSize: '64px',
      color: '#ffe08a',
      stroke: '#2b1b5a',
      strokeThickness: 6,
    }).setOrigin(0.5);

    const subtitle = this.add.text(width / 2, height * 0.38, 'Pixel Chase Comedy Run', {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#ffffff',
    }).setOrigin(0.5);

    const startButton = this.createButton(width / 2, height * 0.55, 'START');
    const howButton = this.createButton(width / 2, height * 0.65, 'HOW TO PLAY');

    const hintText = this.add.text(width / 2, height * 0.78, 'Arrow/WASD: pindah lane · Space: DASH', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#f2f2f2',
    }).setOrigin(0.5);

    startButton.on('pointerdown', () => {
      this.scene.start('Game');
    });

    howButton.on('pointerdown', () => {
      this.showHowToPlay();
    });

    this.scale.on('resize', (gameSize) => {
      const { width: newWidth, height: newHeight } = gameSize;
      title.setPosition(newWidth / 2, newHeight * 0.28);
      subtitle.setPosition(newWidth / 2, newHeight * 0.38);
      startButton.setPosition(newWidth / 2, newHeight * 0.55);
      howButton.setPosition(newWidth / 2, newHeight * 0.65);
      hintText.setPosition(newWidth / 2, newHeight * 0.78);
    });
  }

  createButton(x, y, label) {
    const button = this.add.text(x, y, label, {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#1f1f1f',
      backgroundColor: '#ffe08a',
      padding: { x: 18, y: 10 },
    }).setOrigin(0.5);

    button.setInteractive({ useHandCursor: true });
    return button;
  }

  showHowToPlay() {
    const { width, height } = this.scale;
    const panel = this.add.rectangle(width / 2, height / 2, width * 0.72, height * 0.4, 0x111111, 0.92);
    panel.setStrokeStyle(3, 0xffffff, 0.4);

    const text = this.add.text(width / 2, height / 2, [
      'Lari tanpa henti, hindari halangan, dan jangan sampai dikejar groom!',
      'Pindah lane dengan ↑/↓ atau W/S (atau tombol on-screen).',
      'Tekan DASH untuk boost singkat + kebal 0.25 detik.',
      'Semakin lama bertahan, kecepatan makin tinggi.',
    ], {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: width * 0.68 },
    }).setOrigin(0.5);

    const close = this.createButton(width / 2, height * 0.68, 'CLOSE');
    close.on('pointerdown', () => {
      panel.destroy();
      text.destroy();
      close.destroy();
    });
  }
}
