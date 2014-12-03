define([
  'core/display'
], function(display, controls) {

  var stack = [];

  function show() {
    display.scene.add(this.displayObject);
  }

  function hide() {
    display.scene.remove(this.displayObject);
  }

  function update() {

  }

  return {
    displayObject: null,
    show: show,
    hide: hide,
    update: update
  };
});
