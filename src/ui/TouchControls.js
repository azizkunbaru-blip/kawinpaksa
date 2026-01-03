import { TOUCH_CONTROL_ALPHA, TOUCH_CONTROL_MARGIN, TOUCH_CONTROL_RADIUS } from '../utils/constants.js';

export default class TouchControls {
  constructor(scene) {
    this.scene = scene;
    this.visible = false;
    this.buttons = {};
  }

  create() {
    const { width, height } = this.scene.scale;
    const leftX = TOUCH_CONTROL_MARGIN + TOUCH_CONTROL_RADIUS;
    const rightX = leftX + TOUCH_CONTROL_RADIUS * 2.3;
    const baseY = height - TOUCH_CONTROL_MARGIN - TOUCH_CONTROL_RADIUS;
    const dashX = width - TOUCH_CONTROL_MARGIN - TOUCH_CONTROL_RADIUS;

    this.buttons.left = this.createButton(leftX, baseY, 'LEFT');
    this.buttons.right = this.createButton(rightX, baseY, 'RIGHT');
    this.buttons.dash = this.createButton(dashX, baseY, 'DASH');

    this.setVisible(this.scene.sys.game.device.os.android || this.scene.sys.game.device.os.iOS);
    this.layout();
  }

  createButton(x, y, label) {
    const button = this.scene.add.circle(x, y, TOUCH_CONTROL_RADIUS, 0x111111, TOUCH_CONTROL_ALPHA);
    const text = this.scene.add.text(x, y, label, {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0.5);

    button.setStrokeStyle(2, 0xffffff, 0.25);
    button.setInteractive({ useHandCursor: true });
    return { button, text, label, pressed: false };
  }

  bindHandlers({ onLeft, onRight, onDash }) {
    this.buttons.left.button.on('pointerdown', () => {
      this.buttons.left.pressed = true;
      onLeft();
    });
    this.buttons.right.button.on('pointerdown', () => {
      this.buttons.right.pressed = true;
      onRight();
    });
    this.buttons.dash.button.on('pointerdown', () => {
      this.buttons.dash.pressed = true;
      onDash();
    });
    const reset = (btn) => {
      btn.button.on('pointerup', () => { btn.pressed = false; });
      btn.button.on('pointerout', () => { btn.pressed = false; });
      btn.button.on('pointercancel', () => { btn.pressed = false; });
    };
    Object.values(this.buttons).forEach(reset);
  }

  setVisible(isVisible) {
    this.visible = isVisible;
    Object.values(this.buttons).forEach(({ button, text }) => {
      button.setVisible(isVisible);
      text.setVisible(isVisible);
    });
  }

  layout() {
    if (!this.visible) return;
    const { width, height } = this.scene.scale;
    const leftX = TOUCH_CONTROL_MARGIN + TOUCH_CONTROL_RADIUS;
    const rightX = leftX + TOUCH_CONTROL_RADIUS * 2.3;
    const baseY = height - TOUCH_CONTROL_MARGIN - TOUCH_CONTROL_RADIUS;
    const dashX = width - TOUCH_CONTROL_MARGIN - TOUCH_CONTROL_RADIUS;

    const map = {
      left: [leftX, baseY],
      right: [rightX, baseY],
      dash: [dashX, baseY],
    };

    Object.entries(map).forEach(([key, [x, y]]) => {
      const target = this.buttons[key];
      target.button.setPosition(x, y);
      target.text.setPosition(x, y);
    });
  }
}
