(function (exports) {
  const EnemyArray = function (game, settings) {
    this.c = game.c;

    this.size = { x: WIDTH * 0.75, y: HEIGHT * 0.4 };
    this.center = { x: WIDTH / 2, y: 50 + this.size.y / 2 };
    this.direction = DIRECTIONS.right;

    for (let i in settings) {
      this[i] = settings[i];
    }

    this.speed = this.baseSpeed;

    const that = this;
    this.killed = 0;
    this.totalEnemies = this.rows * this.cols;

    function handleHit(target) {
      target.killed++;

      target.speed =
        target.killed == target.totalEnemies - 1
          ? TOP_SPEED * 1.2
          : convertRange(
              target.killed,
              [0, target.totalEnemies],
              [target.baseSpeed, target.topSpeed]
            );
    }

    hitEvent.addEventListener("hit", () => handleHit(that));

    const colSize = this.size.x / this.cols;
    const rowSize = this.size.y / this.rows;
    const sizeX = Math.min(colSize * 0.8, MAX_ENEMY_SIZE);
    const sizeY = Math.min(rowSize * 0.8, MAX_ENEMY_SIZE);

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this.c.entities.create(Enemy, {
          color: "#0f7",
          row: r,
          col: c,
          center: { x: 0, y: 0 },
          size: {
            x: sizeX,
            y: sizeY,
          },
        });
      }
    }

    let enemies,
      leftMostEnemy,
      rightMostEnemy,
      bottomMostEnemy,
      rightEnemyEdge,
      leftEnemyEdge,
      bottomEnemyEdge,
      topEdge,
      leftEdge;

    this.update = function () {
      if (game.gameOver) {
        return;
      }

      enemies = this.c.entities.all(Enemy);

      if (enemies.length === 0) {
        this.cleared = true;
        return;
      }

      leftMostEnemy = enemies.sort((a, b) =>
        a.center.x < b.center.x ? -1 : 1
      )[0];
      rightMostEnemy = enemies.sort((a, b) =>
        a.center.x > b.center.x ? -1 : 1
      )[0];
      bottomMostEnemy = enemies.sort((a, b) =>
        a.center.y > b.center.y ? -1 : 1
      )[0];

      rightEnemyEdge = rightMostEnemy.center.x + rightMostEnemy.size.x / 2; // this.center.x + this.size.x/2;
      leftEnemyEdge = leftMostEnemy.center.x - leftMostEnemy.size.x / 2; // this.center.x - this.size.x/2;
      bottomEnemyEdge = bottomMostEnemy.center.y + bottomMostEnemy.size.y / 2; // this.center.y + this.size.y / 2;
      topEdge = this.center.y - this.size.y / 2;
      leftEdge = this.center.x - this.size.x / 2;

      if (bottomEnemyEdge >= HEIGHT) {
        this.bottomedOut = true;
        return;
      }

      if (rightEnemyEdge >= WIDTH) {
        this.direction = DIRECTIONS.left;
        this.center.y += Y_INC;
      } else if (leftEnemyEdge <= 0) {
        this.direction = DIRECTIONS.right;
        this.center.y += Y_INC;
      }

      this.center.x +=
        this.direction === DIRECTIONS.right ? this.speed : -this.speed;

      enemies.forEach((enemy) => {
        enemy.center.x = colSize * enemy.col + colSize / 2 + leftEdge;
        enemy.center.y = rowSize * enemy.row + rowSize / 2 + topEdge;
      });

      if (Math.random() < this.bombProb) {
        const index = getRandomIntInclusive(0, enemies.length - 1);
        if (index <= enemies.length - 1) {
          enemies[index].dropBomb();
        }
      }
    };
  };

  exports.EnemyArray = EnemyArray;
})(this);
