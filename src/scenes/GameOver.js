export default class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x0b0b0b, 0.92);

    this.add.text(width / 2, height * 0.3, 'GAME OVER', {
      fontFamily: 'monospace',
      fontSize: '54px',
      color: '#ff8a8a',
      stroke: '#2b1b5a',
      strokeThickness: 6,
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.45, `Skor: ${Math.floor(this.finalScore)}`, {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#ffffff',
    }).setOrigin(0.5);

    const restart = this.createButton(width / 2, height * 0.6, 'RESTART');
    const menu = this.createButton(width / 2, height * 0.7, 'MENU');

    restart.on('pointerdown', () => {
      this.scene.start('Game');
    });
    menu.on('pointerdown', () => {
      this.scene.start('Menu');
    });

    this.scale.on('resize', (gameSize) => {
      const { width: newWidth, height: newHeight } = gameSize;
      restart.setPosition(newWidth / 2, newHeight * 0.6);
      menu.setPosition(newWidth / 2, newHeight * 0.7);
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
}
