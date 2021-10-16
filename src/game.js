(function (exports) {
  const Game = function () {
    this.c = new Coquette(this, "canvas", WIDTH, HEIGHT, "#000");
    this.state = GAME_STATES.GAME_OVER;

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

    function updateScore() {
      scoreSpan.innerHTML = score.toString().padStart(4, "0");
    }

    function updateBullets() {
      bulletsSpan.innerHTML = bulletCount.toString().padStart(4, "0");
    }

    function updateFireRate() {
      const player = that.c.entities.all(Player)[0];
      const current = MAX_TICKS_PER_BULLET - player.ticksPerBullet;
      const percent =
        (current / (MAX_TICKS_PER_BULLET - MIN_TICKS_PER_BULLET)) * 100;
      fireRateSpan.innerHTML = `${percent.toFixed(2)}%`;
    }

    events.addEventListener("hit", (e) => {
      score++;
      updateScore();
      updateAccuracy();
      that.checkSpawnPowerup();
    });

    events.addEventListener("bullet", () => {
      bulletCount++;
      updateBullets();
      updateAccuracy();
    });

    events.addEventListener("firerate", () => {
      updateFireRate();
    });

    this.gameOver = function () {
      return this.state === GAME_STATES.GAME_OVER;
    };

    this.start = function () {
      score = 0;
      bulletCount = 0;
      round = 1;
      bombProb = BASE_BOMB_PROB;
      canSpawnPowerup = true;
      baseSpeed = BASE_SPEED;
      topSpeed = TOP_SPEED;

      // destroy all entities
      const allEntities = this.c.entities.all();
      allEntities.forEach((e) => {
        this.c.entities.destroy(e);
      });

      // player
      this.c.entities.create(Player, {
        center: { x: WIDTH / 2, y: HEIGHT - 20 },
        color: "#07f",
        ticksPerBullet: BASE_TICKS_PER_BULLET,
      });

      this.createNewEnemyArray();
      updateRound();
      updateScore();
      updateBullets();
      updateAccuracy();
      updateFireRate();
      this.state = GAME_STATES.PLAYING;
    };

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

    let baseSpeed = BASE_SPEED;
    let topSpeed = TOP_SPEED;
    this.createNewEnemyArray = function () {
      this.c.entities.create(EnemyArray, {
        color: "#07f",
        rows: ENEMY_ROWS,
        cols: ENEMY_COLS,
        baseSpeed,
        topSpeed,
        bombProb,
      });

      baseSpeed *= ROUND_SPEED_MULT;
      topSpeed *= ROUND_SPEED_MULT;
    };

    let entities, player, enemyArray, bullets;

    this.update = function () {
      if (this.state === GAME_STATES.WAITING) {
        if (this.c.inputter.isDown(this.c.inputter.SPACE)) {
          this.start();
        }
        return;
      }

      if (this.state === GAME_STATES.GAME_OVER) {
        if (this.c.inputter.isDown(this.c.inputter.SPACE)) {
          this.start();
        }
        return;
      }

      entities = this.c.entities.all();
      player = entities.find((e) => e instanceof Player);
      enemyArray = entities.find((e) => e instanceof EnemyArray);

      if (player.dead || enemyArray.bottomedOut) {
        this.state = GAME_STATES.GAME_OVER;
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

    this.draw = function (ctx) {
      if (this.state === GAME_STATES.WAITING) {
        this.drawWaiting(ctx);
        return;
      }

      if (this.state === GAME_STATES.GAME_OVER) {
        this.drawGameOver(ctx);
        return;
      }
    };

    this.drawWaiting = function (ctx) {
      ctx.fillStyle = "#07f";
      ctx.font = "100px monospace";
      ctx.fillText("BLIT", WIDTH / 2 - 115, HEIGHT / 2);
      ctx.font = "25px monospace";
      ctx.fillText(
        "press space bar to start",
        WIDTH / 2 - 170,
        HEIGHT / 2 + 100
      );
    };

    this.drawGameOver = function (ctx) {
      ctx.fillStyle = "#07f";
      ctx.font = "100px monospace";
      ctx.fillText("game over", WIDTH / 2 - 260, HEIGHT / 2);
      ctx.font = "25px monospace";
      ctx.fillText(
        "press space bar to play again",
        WIDTH / 2 - 210,
        HEIGHT / 2 + 100
      );
    };
  };

  exports.Game = Game;
})(this);
