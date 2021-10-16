(function (exports) {
  exports.WIDTH = 800;
  exports.HEIGHT = 600;
  exports.PLAYER_MOVE_SPEED = 6;
  exports.PLAYER_SIZE = 15;
  exports.POWERUP_SIZE = 17;
  exports.BULLET_SIZE = 4;
  exports.DIRECTIONS = { RIGHT: 'RIGHT', LEFT: 'LEFT' };
  exports.BASE_SPEED = 0.1;
  exports.TOP_SPEED = 2.2;
  exports.Y_INC = 10;
  exports.MAX_ENEMY_SIZE = 20;
  exports.ENEMY_SIZE_RATIO = 0.5;
  exports.ENEMY_ROWS = 5;
  exports.ENEMY_COLS = 10;
  exports.GROUPS = { INVISIBLE: 0, ENEMY: 1, PLAYER: 2 };
  exports.BASE_TICKS_PER_BULLET = 22;
  exports.MIN_TICKS_PER_BULLET = 2;
  exports.MAX_TICKS_PER_BULLET = 42;
  exports.BOMB_PROB_MULT = 1.2;
  exports.BASE_BOMB_PROB = 0.01;
  exports.ROUND_SPEED_MULT = 1.01;
  exports.GAME_STATES = { WAITING: 'WAITING', PLAYING: 'PLAYING', GAME_OVER: 'GAME_OVER'}

})(this);
