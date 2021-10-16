(function (exports) {
  const Bullet = function (game, settings) {
    this.c = game.c;
    this.size = { x: BULLET_SIZE, y: BULLET_SIZE };

    for (let i in settings) {
      this[i] = settings[i];
    }

    this.update = function () {
      if (game.gameOver()) {
        return;
      }

      this.center.y += this.vector.y;
      if (this.center.y < 0) {
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
  };

  exports.Bullet = Bullet;
})(this);
