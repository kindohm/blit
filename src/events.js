(function (exports) {
  class GameEvents extends EventTarget {
    hit() {
      this.dispatchEvent(new Event("hit"));
    }

    bullet() {
      this.dispatchEvent(new Event("bullet"));
    }
  }

  const events = new GameEvents();

  exports.events = events;
})(this);
