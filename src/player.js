(function (exports) {
  const Player = function (game, settings) {
    this.c = game.c;
    this.group = GROUPS.PLAYER;
    this.size = { x: PLAYER_SIZE, y: PLAYER_SIZE };
    this.bulletTicks = 0;

    for (let i in settings) {
      this[i] = settings[i];
    }

    this.update = function () {
      if (game.gameOver) {
        return;
      }

      this.bulletTicks++;

      if (
        this.c.inputter.isDown(this.c.inputter.LEFT_ARROW) ||
        this.c.inputter.isDown(this.c.inputter.A)
      ) {
        this.center.x = Math.max(
          this.center.x - PLAYER_MOVE_SPEED,
          this.size.x / 2
        );
      }
      if (
        this.c.inputter.isDown(this.c.inputter.RIGHT_ARROW) ||
        this.c.inputter.isDown(this.c.inputter.D)
      ) {
        this.center.x = Math.min(
          this.center.x + PLAYER_MOVE_SPEED,
          WIDTH - this.size.x / 2
        );
      }

      if (
        this.c.inputter.isDown(this.c.inputter.SPACE) &&
        this.bulletTicks > 3
      ) {
        // spawn a bullet
        this.c.entities.create(Bullet, {
          center: {
            x: this.center.x,
            y: this.center.y - this.size.y,
          },
          vector: { x: 0, y: -10 },
          color: settings.color,
          group: this.group,
        });

        this.bulletTicks = 0;
      }
    };

    this.draw = function (ctx) {
      ctx.fillStyle = settings.color;
      ctx.fillRect(
        this.center.x - this.size.x / 2,
        this.center.y - this.size.y / 2,
        this.size.x,
        this.size.y
      );
    };

    this.collision = function (other) {
      if (other.group !== this.group) {
        this.dead = true;
      }
    };
  };

  exports.Player = Player;
})(this);
