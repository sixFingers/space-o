define([
  'three.three',
  'three.orbit-controls',
  'threex.screenshot',
  'threex.fullscreen',
  'threex.window-resize',
  'threex.dom-events',
  'core/display',
], function(THREE, OrbitControls, Screenshot, FullScreen, WindowResize, DomEvents, display) {

  var cameraMaxDistance = 1600;

  function init() {
    // create a camera contol
    this.cameraControls = new THREE.OrbitControls(display.camera);

    // transparently support window resize
    THREEx.WindowResize.bind(display.renderer, display.camera);

    // allow 'p' to make screenshot
    THREEx.Screenshot.bindKey(display.renderer);

    // allow 'f' to go fullscreen where this feature is supported
    if (THREEx.FullScreen.available()) {
      THREEx.FullScreen.bindKey();
      document.getElementById('inlineDoc').innerHTML += "- <i>f</i> for fullscreen";
    }

    this.domEvents = new THREEx.DomEvents(display.camera, display.renderer.domElement);
  };

  function update() {
    this.cameraControls.update();
    var length = display.camera.position.length();

    display.camera.position = length < cameraMaxDistance ? 
      display.camera.position:
      display.camera.position.normalize().multiplyScalar(cameraMaxDistance);
  };

  return {
    cameraMaxDistance: cameraMaxDistance,
    init: init,
    update: update
  };
});
