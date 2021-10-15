(function (exports) {
  class HitEvent extends EventTarget {
    hit() {
      this.dispatchEvent(new Event("hit"));
    }
  }

  const hitEvent = new HitEvent();

  exports.hitEvent = hitEvent;
})(this);
