require.config({
  paths: {
    '_': 'vendor/underscore-min',
    'three': 'vendor/three.js',
    'threex': 'vendor/threex',
    'three.three': 'vendor/three.js/Three',
    'three.detector': 'vendor/three.js/Detector',
    'three.stats': 'vendor/three.js/Stats',
    'three.orbit-controls': 'vendor/three.js/OrbitControls',
    'threex.screenshot': 'vendor/threex/THREEx.Screenshot',
    'threex.fullscreen': 'vendor/threex/THREEx.FullScreen',
    'threex.window-resize': 'vendor/threex/THREEx.WindowResize',
    'threex.keyboard-state': 'vendor/threex/THREEx.KeyboardState',
    'threex.dom-events': 'vendor/threex/THREEx.DomEvents', 
    'templates': '../templates', 
    'text': 'vendor/require/text'
  },
  shim: {
    'three.three': {
      exports: 'THREE'
    },
    'three.detector': {
      deps: ['three.three'],
      exports: 'Detector'
    },
    'three.stats': {
      deps: ['three.three'],
      exports: 'Stats'
    },
    'three.orbit-controls': {
      deps: ['three.three'],
      exports: 'OrbitControls'
    },
    '_': {
      exports: '_'
    }
  }
});

require(['game'], function(game) {

  game.init();
});
