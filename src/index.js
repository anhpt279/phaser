import Phaser from "phaser";
import sky from "./sky.png";
import ground from "./platform.png";
import star from "./star.png";
import bomb from "./bomb.png";
import monkey from "./dude.png";

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
    this.player = this.physics.add.sprite(100, 450, "dude");
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, platform);
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    const stars = this.physics.add.group({
      key: "star",
      repeat: "11",
      setXY: { x: 12, y: 0, stepX: 70 },
    });
    stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    this.physics.add.collider(stars, platform);
    this.physics.add.overlap(this.player, stars, collect, null, this);

    const bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platform);
    this.physics.add.collider(this.player, bombs, bombTouched, null, this);

    function bombTouched(player, bomb) {
      this.physics.pause();
      this.player.setTint(0xff000);
      this.player.anims.play("turn");
    }

    const scoreText = this.add.text(15, 15, "score: 0", {
      fontSize: "32px",
      fill: "#000",
    });
    let score = 0;

    function collect(player, star) {
      star.disableBody(true, true);
      score += 1;
      scoreText.setText("Score:" + score);

      if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {
          child.enableBody(true, child.x, 0, true, true);
        });

        var x =
          player.x < 400
            ? Phaser.Math.Between(400, 800)
            : Phaser.Math.Between(0, 400);

        const bomb = bombs.create(x, 16, "bomb");
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      }
    }
  }

  update() {
    const cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("left", true);
    } else if (cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }

    if (cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-360);
    }
  }
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
      debug: false,
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
