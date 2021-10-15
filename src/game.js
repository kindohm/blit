(function (exports) {
  const Game = function () {
    this.c = new Coquette(this, "canvas", WIDTH, HEIGHT, "#000");

    const scoreSpan = document.getElementById("score");

    let score = 0;
    let rounds = 1;
    let bombProb = 0.01;

    hitEvent.addEventListener("hit", (e) => {
      score++;
      scoreSpan.innerHTML = score.toString().padStart(4, "0");
    });

    this.gameOver = false;

    // player
    this.c.entities.create(Player, {
      center: { x: WIDTH / 2, y: HEIGHT - 20 },
      color: "#07f",
    });

    this.createNewEnemyArray = function () {
      this.c.entities.create(EnemyArray, {
        color: "#07f",
        rows: ENEMY_ROWS,
        cols: ENEMY_COLS,
        baseSpeed: BASE_SPEED,
        topSpeed: TOP_SPEED,
        bombProb,
      });
    };

    this.createNewEnemyArray();

    let entities, player, enemyArray, bullets;

    this.update = function () {
      entities = this.c.entities.all();
      player = entities.find((e) => e instanceof Player);
      enemyArray = entities.find((e) => e instanceof EnemyArray);

      if (player.dead || enemyArray.bottomedOut) {
        this.gameOver = true;
        return;
      }

      if (enemyArray.cleared) {
        this.c.entities.destroy(enemyArray);

        bullets = this.c.entities.all(Bullet);
        bullets.forEach((b) => this.c.entities.destroy(b));

        bombProb *= 1.2;
        this.createNewEnemyArray();
      }
    };
  };

  exports.Game = Game;
})(this);
