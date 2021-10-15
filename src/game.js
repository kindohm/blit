(function (exports) {
  const Game = function () {
    this.c = new Coquette(this, "canvas", WIDTH, HEIGHT, "#000");

    const totalEnemies = ENEMY_COLS * ENEMY_ROWS;
    const scoreSpan = document.getElementById("score");
    const bulletsSpan = document.getElementById("bullets");
    const accuracySpan = document.getElementById("accuracy");
    const roundSpan = document.getElementById("round");
    const fireRateSpan = document.getElementById("fireRate");

    let score = 0;
    let bulletCount = 0;
    let round = 1;
    let bombProb = BASE_BOMB_PROB;
    let canSpawnPowerup = true;
    let that = this;

    function updateAccuracy() {
      const percent = bulletCount > 0 ? (score / bulletCount) * 100 : 0;
      const percentString = `${percent.toFixed(2)}%`;
      accuracySpan.innerHTML = percentString;
    }

    function updateRound() {
      roundSpan.innerHTML = round.toString().padStart(4, "0");
    }

    events.addEventListener("hit", (e) => {
      score++;
      scoreSpan.innerHTML = score.toString().padStart(4, "0");
      updateAccuracy();
      that.checkSpawnPowerup();
    });

    events.addEventListener("bullet", () => {
      bulletCount++;
      bulletsSpan.innerHTML = bulletCount.toString().padStart(4, "0");
      updateAccuracy();
    });

    events.addEventListener("firerate", () => {
      const player = that.c.entities.all(Player)[0];
      const current = MAX_TICKS_PER_BULLET - player.ticksPerBullet;
      const percent = current / (MAX_TICKS_PER_BULLET - MIN_TICKS_PER_BULLET) * 100;
      fireRateSpan.innerHTML = `${percent.toFixed(2)}%`;
    })

    this.gameOver = false;

    // player
    this.c.entities.create(Player, {
      center: { x: WIDTH / 2, y: HEIGHT - 20 },
      color: "#07f",
      ticksPerBullet: BASE_TICKS_PER_BULLET
    });

    this.checkSpawnPowerup = function () {
      if (!canSpawnPowerup) {
        return;
      }

      const enemies = this.c.entities.all(Enemy);
      if (enemies.length / totalEnemies > 0.5) {
        return;
      }

      canSpawnPowerup = false;
      this.c.entities.create(Powerup, {
        spawnX: -10,
        maxX: WIDTH + 10,
        color: "#f70",
      });
    };

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
    updateRound();

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

        bombProb *= BOMB_PROB_MULT;
        this.createNewEnemyArray();
        round++;
        updateRound();
        canSpawnPowerup = true;
      }
    };
  };

  exports.Game = Game;
})(this);
