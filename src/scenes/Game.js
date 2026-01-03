import TouchControls from '../ui/TouchControls.js';
import {
  BG_LAYER_KEYS,
  BASE_SPEED,
  CAMERA_SHAKE,
  DASH_COOLDOWN_MS,
  DASH_DURATION_MS,
  DASH_SPEED_BOOST,
  DISTANCE_MAX,
  DISTANCE_START,
  GAME_HEIGHT,
  GAMEOVER_DISTANCE,
  GAME_WIDTH,
  GROOM_START_OFFSET,
  GROOM_TEXTURE_KEY,
  HIT_SLOW_FACTOR,
  HIT_STUN_MS,
  HUD_FONT_SIZE,
  HUD_PADDING,
  LANE_Y,
  MAX_SPEED,
  OBSTACLE_SPAWN_BASE_MS,
  OBSTACLE_SPAWN_DECAY,
  OBSTACLE_SPAWN_MIN_MS,
  OBSTACLE_TYPES,
  PARALLAX_LAYER_SPEEDS,
  PLAYER_LANE_INDEX,
  PLAYER_START_X,
  PLAYER_TEXTURE_KEY,
  RUBBER_BAND_GAIN,
  RUBBER_BAND_RELAX,
  RUBBER_BAND_SAFE_TIME_MS,
  SCORE_DODGE_BONUS,
  SPEED_INCREMENT,
  SPEED_INTERVAL_MS,
} from '../utils/constants.js';

export default class Game extends Phaser.Scene {
  constructor() {
    super('Game');
    this.player = null;
    this.groom = null;
    this.obstacles = null;
    this.backgrounds = [];
    this.cursors = null;
    this.keys = null;
    this.touchControls = null;
    this.scoreText = null;
    this.speedText = null;
    this.distanceText = null;
    this.dashBar = null;
    this.dashBarBg = null;
    this.dashReadyText = null;
    this.state = {};
  }

  create() {
    this.createBackgrounds();
    this.createDashDustTexture();
    this.createActors();
    this.createObstacles();
    this.createHud();
    this.createInput();

    this.state = {
      speed: BASE_SPEED,
      targetSpeed: BASE_SPEED,
      distance: DISTANCE_START,
      score: 0,
      lastDodgeTime: 0,
      dodgeStreak: 0,
      lastSafeTime: this.time.now,
      hitUntil: 0,
      dashReadyAt: 0,
      dashActiveUntil: 0,
      spawnInterval: OBSTACLE_SPAWN_BASE_MS,
      nextSpawnAt: this.time.now + 800,
      speedTimer: this.time.now + SPEED_INTERVAL_MS,
    };

    this.physics.add.overlap(this.player, this.obstacles, this.handlePlayerHit, null, this);

    this.scale.on('resize', () => {
      this.layoutHud();
      this.touchControls.layout();
    });
  }

  createBackgrounds() {
    this.backgrounds = BG_LAYER_KEYS.map((key, index) => {
      const sprite = this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, key)
        .setOrigin(0)
        .setScrollFactor(0);
      sprite.setDepth(index);
      return sprite;
    });
  }

  createActors() {
    this.player = this.physics.add.sprite(PLAYER_START_X, LANE_Y[PLAYER_LANE_INDEX], PLAYER_TEXTURE_KEY);
    this.player.setOrigin(0.5, 0.5);
    this.player.setImmovable(true);
    this.player.body.setSize(this.player.width * 0.7, this.player.height * 0.75, true);
    this.player.laneIndex = PLAYER_LANE_INDEX;
    this.player.targetY = LANE_Y[PLAYER_LANE_INDEX];

    this.groom = this.physics.add.sprite(PLAYER_START_X - GROOM_START_OFFSET, LANE_Y[PLAYER_LANE_INDEX], GROOM_TEXTURE_KEY);
    this.groom.setOrigin(0.5, 0.5);
    this.groom.setImmovable(true);
    this.groom.body.setSize(this.groom.width * 0.7, this.groom.height * 0.75, true);

    this.createRunAnimation(this.player, 1);
    this.createRunAnimation(this.groom, -1);
  }

  createRunAnimation(sprite, bobDirection) {
    this.tweens.add({
      targets: sprite,
      y: sprite.y + 4 * bobDirection,
      duration: 220,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  createObstacles() {
    this.obstacles = this.physics.add.group({
      allowGravity: false,
      immovable: true,
      maxSize: 18,
    });
  }

  createHud() {
    this.scoreText = this.add.text(0, 0, 'Skor: 0', {
      fontFamily: 'monospace',
      fontSize: `${HUD_FONT_SIZE}px`,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
    }).setScrollFactor(0);

    this.speedText = this.add.text(0, 0, 'Kecepatan: 0', {
      fontFamily: 'monospace',
      fontSize: `${HUD_FONT_SIZE}px`,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
    }).setScrollFactor(0);

    this.distanceText = this.add.text(0, 0, 'Jarak: 0m', {
      fontFamily: 'monospace',
      fontSize: `${HUD_FONT_SIZE}px`,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
    }).setScrollFactor(0);

    this.dashBarBg = this.add.rectangle(0, 0, 160, 14, 0x1f1f1f, 0.7).setOrigin(0, 0.5);
    this.dashBar = this.add.rectangle(0, 0, 160, 14, 0x66ff9b, 0.9).setOrigin(0, 0.5);
    this.dashReadyText = this.add.text(0, 0, 'DASH', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(1, 0.5);

    this.layoutHud();
  }

  layoutHud() {
    const { width } = this.scale;
    const left = HUD_PADDING;
    const top = HUD_PADDING;

    this.scoreText.setPosition(left, top);
    this.speedText.setPosition(left, top + 28);
    this.distanceText.setPosition(left, top + 56);

    const barWidth = Math.min(200, width * 0.32);
    this.dashBarBg.setSize(barWidth, 14).setPosition(left, top + 92);
    this.dashBar.setSize(barWidth, 14).setPosition(left, top + 92);
    this.dashReadyText.setPosition(left + barWidth + 56, top + 92);
  }

  createInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({ up: 'W', down: 'S', dash: 'SPACE' });

    this.touchControls = new TouchControls(this);
    this.touchControls.create();
    this.touchControls.bindHandlers({
      onLeft: () => this.moveLane(-1),
      onRight: () => this.moveLane(1),
      onDash: () => this.triggerDash(),
    });
  }

  update(time, delta) {
    const deltaSec = delta / 1000;
    this.updateDifficulty(time);
    this.updatePlayerMovement(deltaSec);
    this.updateGroom(deltaSec);
    this.updateBackgrounds(deltaSec);
    this.updateObstacles(deltaSec);
    this.updateDashHud(time);
    this.updateScore(time, deltaSec);

    if (this.state.distance <= GAMEOVER_DISTANCE) {
      this.scene.start('GameOver', { score: this.state.score });
    }
  }

  updateDifficulty(time) {
    if (time >= this.state.speedTimer) {
      this.state.targetSpeed = Math.min(MAX_SPEED, this.state.targetSpeed + SPEED_INCREMENT);
      this.state.speedTimer = time + SPEED_INTERVAL_MS;
      this.state.spawnInterval = Math.max(
        OBSTACLE_SPAWN_MIN_MS,
        this.state.spawnInterval - OBSTACLE_SPAWN_DECAY,
      );
    }
  }

  updatePlayerMovement(deltaSec) {
    const isHit = this.state.hitUntil > this.time.now;
    const isDashing = this.state.dashActiveUntil > this.time.now;

    const inputUp = this.cursors.up.isDown || this.keys.up.isDown;
    const inputDown = this.cursors.down.isDown || this.keys.down.isDown;
    const dashKey = this.keys.dash;

    if (Phaser.Input.Keyboard.JustDown(dashKey)) {
      this.triggerDash();
    }

    if (inputUp) {
      this.moveLane(-1);
    } else if (inputDown) {
      this.moveLane(1);
    }

    const targetSpeed = isHit ? this.state.targetSpeed * HIT_SLOW_FACTOR : this.state.targetSpeed;
    const dashBoost = isDashing ? DASH_SPEED_BOOST : 0;
    this.state.speed = Phaser.Math.Linear(this.state.speed, targetSpeed + dashBoost, 0.08);

    this.player.y = Phaser.Math.Linear(this.player.y, this.player.targetY, 0.22);
  }

  moveLane(direction) {
    const nextIndex = Phaser.Math.Clamp(this.player.laneIndex + direction, 0, LANE_Y.length - 1);
    if (nextIndex !== this.player.laneIndex) {
      this.player.laneIndex = nextIndex;
      this.player.targetY = LANE_Y[nextIndex];
    }
  }

  updateGroom(deltaSec) {
    this.state.distance -= (this.state.speed * deltaSec) * RUBBER_BAND_GAIN;
    if (this.time.now - this.state.lastSafeTime > RUBBER_BAND_SAFE_TIME_MS) {
      this.state.distance += RUBBER_BAND_RELAX;
    }
    this.state.distance = Phaser.Math.Clamp(this.state.distance, GAMEOVER_DISTANCE, DISTANCE_MAX);

    const groomTargetX = this.player.x - this.state.distance;
    this.groom.x = Phaser.Math.Linear(this.groom.x, groomTargetX, 0.08);
    this.groom.y = Phaser.Math.Linear(this.groom.y, this.player.y, 0.2);
  }

  updateBackgrounds(deltaSec) {
    this.backgrounds.forEach((layer, index) => {
      layer.tilePositionX += this.state.speed * PARALLAX_LAYER_SPEEDS[index] * deltaSec;
    });
  }

  updateObstacles(deltaSec) {
    if (this.time.now >= this.state.nextSpawnAt) {
      this.spawnObstacle();
      this.state.nextSpawnAt = this.time.now + this.state.spawnInterval;
    }

    this.obstacles.children.iterate((child) => {
      if (!child) return;
      child.x -= this.state.speed * deltaSec;
      if (child.x < -80) {
        child.active = false;
        child.visible = false;
        child.body.enable = false;
      }
    });
  }

  spawnObstacle() {
    const obstacle = this.obstacles.getFirstDead(false);
    const laneIndex = Phaser.Math.Between(0, LANE_Y.length - 1);
    const type = Phaser.Utils.Array.GetRandom(OBSTACLE_TYPES);

    const spawnX = this.scale.width + Phaser.Math.Between(40, 120);
    const spawnY = LANE_Y[laneIndex];

    const obstacleSprite = obstacle || this.obstacles.create(spawnX, spawnY, type.key);
    obstacleSprite.setTexture(type.key);
    obstacleSprite.setActive(true);
    obstacleSprite.setVisible(true);
    obstacleSprite.body.enable = true;
    obstacleSprite.setPosition(spawnX, spawnY);
    obstacleSprite.body.setSize(type.width * 0.8, type.height * 0.8, true);
    obstacleSprite.laneIndex = laneIndex;
  }

  handlePlayerHit(player, obstacle) {
    if (this.state.hitUntil > this.time.now) return;
    if (this.state.dashActiveUntil > this.time.now) return;

    this.state.hitUntil = this.time.now + HIT_STUN_MS;
    this.state.distance = Math.max(GAMEOVER_DISTANCE, this.state.distance - 24);
    this.state.lastSafeTime = this.time.now;
    this.state.dodgeStreak = 0;

    this.cameras.main.shake(CAMERA_SHAKE.duration, CAMERA_SHAKE.intensity);

    obstacle.active = false;
    obstacle.visible = false;
    obstacle.body.enable = false;
  }

  triggerDash() {
    if (this.time.now < this.state.dashReadyAt) return;

    this.state.dashReadyAt = this.time.now + DASH_COOLDOWN_MS;
    this.state.dashActiveUntil = this.time.now + DASH_DURATION_MS;
    this.emitDashDust();
  }

  emitDashDust() {
    const particles = this.add.particles(0, 0, 'dashDust', {
      x: this.player.x - 18,
      y: this.player.y + 10,
      speed: { min: -40, max: -80 },
      scale: { start: 0.6, end: 0 },
      lifespan: 280,
      quantity: 6,
      tint: [0xffffff, 0xdcdcdc],
    });

    this.time.delayedCall(200, () => particles.destroy());
  }

  updateDashHud(time) {
    const remaining = Math.max(0, this.state.dashReadyAt - time);
    const ratio = 1 - (remaining / DASH_COOLDOWN_MS);
    this.dashBar.scaleX = Phaser.Math.Clamp(ratio, 0.05, 1);
    this.dashReadyText.setText(remaining <= 0 ? 'DASH READY' : `DASH ${Math.ceil(remaining / 100) / 10}s`);
  }

  updateScore(time, deltaSec) {
    this.state.score += deltaSec;

    if (this.state.lastSafeTime + RUBBER_BAND_SAFE_TIME_MS <= time) {
      this.state.dodgeStreak += deltaSec;
      this.state.score += deltaSec * SCORE_DODGE_BONUS;
    }

    this.scoreText.setText(`Skor: ${Math.floor(this.state.score)}`);
    this.speedText.setText(`Kecepatan: ${Math.floor(this.state.speed)}px/s`);
    this.distanceText.setText(`Jarak: ${Math.floor(this.state.distance)}m`);
  }

  createDashDustTexture() {
    if (this.textures.exists('dashDust')) return;
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(4, 4, 4);
    graphics.generateTexture('dashDust', 8, 8);
    graphics.destroy();
  }

  sceneShutdown() {
    this.input.keyboard.removeAllKeys();
  }
}
