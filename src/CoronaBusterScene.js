import Phaser from "phaser";

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("corona buster-scene");
  }
  init() {
    this.clouds = undefined;

    this.nav_left = false;
    this.nav_right = false;
    this.shoot = false;

    this.player = undefined;
    this.speed = 100;
  }
  preload() {
    this.load.image("background", "images/bg_layer1.png");
    this.load.image("cloud", "images/cloud.png");

    this.load.image("nav_left", "images/left-btn.png");
    this.load.image("nav_right", "images/right-btn.png");
    this.load.image("shoot", "images/shoot-btn.png");

    this.load.spritesheet("player", "images/ship.png", {
      frameWidth: 66,
      frameHeight: 66,
    });
  }
  create() {
    const gameWidth = this.scale.width * 0.5;
    const gameHeight = this.scale.height * 0.5;

    this.add.image(gameWidth, gameHeight, "background");

    this.clouds = this.physics.add.group({
      key: "cloud",
      repeat: 10,
    });

    Phaser.Actions.RandomRectangle(
      this.clouds.getChildren(),
      this.physics.world.bounds
    );

    this.createButton();
    this.player = this.createPlayer();
  }
  update(time) {
    this.clouds.children.iterate((child) => {
      child.setVelocityY(50);

      if (child.y > this.scale.height) {
        child.x = Phaser.Math.Between(10, 400);
        child.y = 0;
      }
    });

    this.movePlayer(this.player, time);
  }

  createButton() {
    this.input.addPointer(3);

    this.nav_left = false;
    this.nav_right = false;
    this.shoot = false;

    let shoot = this.add
      .image(320, 550, "shoot")
      .setInteractive()
      .setDepth(0.5)
      .setAlpha(0.8);

    let nav_left = this.add
      .image(50, 550, "nav_left")
      .setInteractive()
      .setDepth(0.5)
      .setAlpha(0.8);

    let nav_right = this.add
      .image(nav_left.x + nav_left.displayWidth + 20, 550, "nav_right")
      .setInteractive()
      .setDepth(0.5)
      .setAlpha(0.8);

    nav_left.on(
      "pointerdown",
      () => {
        this.nav_left = true;
        this.nav_right = false; 
      },
      this
    );

    nav_left.on(
      "pointerup",
      () => {
        this.nav_left = false;
      },
      this
    );

    nav_right.on(
      "pointerdown",
      () => {
        this.nav_right = true;
        this.nav_left = false; 
      },
      this
    );

    nav_right.on(
      "pointerup",
      () => {
        this.nav_right = false;
      },
      this
    );

    shoot.on(
      "pointerdown",
      () => {
        this.shoot = true;
      },
      this
    );

    shoot.on(
      "pointerup",
      () => {
        this.shoot = false;
      },
      this
    );
  }

  movePlayer(player, time) {
    if (this.nav_left) {
      console.log("kiri");
      this.player.setVelocityX(this.speed * -1);
      this.player.anims.play("left", true);
      this.player.setFlipX(false);
    } else if (this.nav_right) {
      console.log("kanan");
      this.player.setVelocityX(this.speed);
      this.player.anims.play("right", true);
      this.player.setFlipX(true);
    } else {
      console.log("tengah");
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }
  }

  createPlayer() {
    const player = this.physics.add.sprite(200, 450, "player");
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: "turn",
      frames: [
        {
          key: "player",
          frame: 0,
        },
      ],
    });

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", {
        start: 1,
        end: 2,
      }),
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 1,
        end: 2,
      }),
    });

    return player;
  }
}
