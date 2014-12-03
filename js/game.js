define([
  'core/animation',
  'core/display',
  'core/controls',
  'factories/stars', 
  'components/gui'
], function(animation, display, controls, starFactory, gui) {

  return {
    animation: animation,
    display: display,

    init: function() {
      display.init();
      controls.init();
      gui.init();

      animation.registerUpdateHook(controls, 'update');
      animation.registerUpdateHook(display, 'update');
      animation.registerUpdateHook(gui, 'update');

      // var skybox = starFactory.getObject('skybox');
      // skybox.show();

      var starfield = starFactory.getObject('starfield');
      starfield.show();

      var star = starFactory.getObject('star');
      star.show();

      animation.init();
    }
  };
});
