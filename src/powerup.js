(function (exports) {
  const Powerup = function (game, settings) {
    this.c = game.c;
    this.size = { x: POWERUP_SIZE * 2, y: POWERUP_SIZE };

    for (let i in settings) {
      this[i] = settings[i];
    }

    const backwards = Math.random() > 0.5;
    this.center = { x: backwards? this.maxX : this.spawnX, y: 60 };
    this.vector = { x: backwards ? -2 : 2, y: 0 };

    this.update = function () {
      if (game.gameOver) {
        return;
      }

      this.center.y += this.vector.y;
      this.center.x += this.vector.x;


      if (this.center.x < this.spawnX || this.center.x > this.maxX) {
        this.c.entities.destroy(this);
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
      if (other instanceof Bullet) {
        this.c.entities.destroy(this);
        this.c.entities.destroy(other);
        events.powerup();
      }
    };
  };

  exports.Powerup = Powerup;
})(this);
