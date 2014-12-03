define([
  'three.three',
  'three.detector',
  'three.stats',
], function(THREE, Detector, Stats) {

  function init() {
    // Initialize renderer
    if (Detector.webgl) {
      this.renderer = new THREE.WebGLRenderer({
        // antialias: true, // to get smoother output
        preserveDrawingBuffer: true // to allow screenshot
      });
      this.renderer.setClearColor(0x000000);
    } else {
      Detector.addGetWebGLMessage();
      return true;
    }

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(this.renderer.domElement);

    // add Stats.js - https://github.com/mrdoob/stats.js
    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.bottom = '0px';
    document.body.appendChild(this.stats.domElement);

    // create a scene
    this.scene = new THREE.Scene();

    // put a camera in the scene
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);
    this.camera.position.set(0, 0, 5);
    this.scene.add(this.camera);
  }

  function update() {
    this.renderer.render(this.scene, this.camera);
    this.stats.update();
  }

  return {
    init: init,
    update: update
  };
});
