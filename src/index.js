import Phaser from "phaser";
import logoImg from "./assets/logo.png";
import sky from "./assets/sky.png";
import ground from "./assets/platform.png";
import star from "./assets/star.png";
import bomb from "./assets/bomb.png";
import monkey from "./assets/dude.png";

class MyGame extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.load.image("sky", sky);
    this.load.image("ground", ground);
    this.load.image("star", star);
    this.load.image("bomb", bomb);
    this.load.spritesheet("dude", monkey, {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    this.add.image(400, 300, "sky");

    const platform = this.physics.add.staticGroup();
    platform.create(400, 568, "ground").setScale(2).refreshBody();

    platform.create(600, 400, "ground");
    platform.create(50, 250, "ground");
    platform.create(750, 220, "ground");
    this.player = this.physics.add.sprite(100, 400, "dude");
  }

  update() {}
}

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  physical: {
    default: "arcade",
    arcade: {
      gravity: { y: 450 },
      debug: true,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: MyGame,
};

const game = new Phaser.Game(config);
