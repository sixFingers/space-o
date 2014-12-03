define([
  '_',
  'factories/factory',
  'entities/skybox',
  'entities/starfield',
  'entities/star'
], function(_, factory, Skybox, Starfield, Star) {
  return _(factory).extend({
    getObject: function(className, attributes) {
      switch(className) {
        case 'skybox': className = Skybox; break;
        case 'starfield': className = Starfield; break;
        case 'star': className = Star; break;
      }

      var instance = factory._getObject(className, attributes);
      instance.init();

      return instance;
    }
  });
});
