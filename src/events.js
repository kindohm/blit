(function (exports) {
  class GameEvents extends EventTarget {
    hit() {
      this.dispatchEvent(new Event("hit"));
    }

    bullet() {
      this.dispatchEvent(new Event("bullet"));
    }

    powerup(){
      this.dispatchEvent(new Event("powerup"));
    }

    fireRate(){
      this.dispatchEvent(new Event("firerate"))
    }
  }

  const events = new GameEvents();

  exports.events = events;
})(this);
