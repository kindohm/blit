(function (exports) {
  const Enemy = function (game, settings) {
    this.c = game.c;
    this.group = GROUPS.ENEMY;

    for (let i in settings) {
      this[i] = settings[i];
    }

    this.dropBomb = function () {
      // spawn a bullet
      this.c.entities.create(Bullet, {
        center: {
          x: this.center.x,
          y: this.center.y + this.size.y / 2,
        },
        vector: { x: 0, y: 5 },
        color: settings.color,
        group: this.group,
      });
    };

    this.draw = function (ctx) {
      ctx.strokeStyle = settings.color;
      ctx.strokeRect(
        this.center.x - this.size.x / 2,
        this.center.y - this.size.y / 2,
        this.size.x,
        this.size.y
      );
    };

    this.collision = function (other) {
      if (other.group !== this.group && other instanceof Bullet) {
        hitEvent.hit();
        this.c.entities.destroy(this);
        this.c.entities.destroy(other);
      }
    };
  };

  exports.Enemy = Enemy;
})(this);
