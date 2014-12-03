define([
  'three.three'
], function(THREE) {

  var clock = new THREE.Clock();
  var hooks = [];

  function animate() {
    // loop on request animation loop
    // - it has to be at the begining of the function
    // - see details at http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
    requestAnimationFrame(animate);

    for(var h = 0; h < hooks.length; h ++) {
      hooks[h].caller[hooks[h].callable].call(hooks[h].caller);
    }
  };

  function init() {
    animate();
  };

  function registerUpdateHook(caller, callable, priority) {
    priority = priority !== undefined ? priority: -1;
    hooks.push({caller: caller, callable: callable});
  }

  return {
    clock: clock,
    init: init,
    animate: animate,
    registerUpdateHook: registerUpdateHook,
  };
});
