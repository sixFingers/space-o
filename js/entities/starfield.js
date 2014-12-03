define([
  'behaviours/displayable',
], function(displayable) {
    
    function Starfield() {
      this.behaviours = [displayable];
    };

    Starfield.prototype.init = function() {
      this.displayObject = this.createMesh();
    }

    Starfield.prototype.createMesh = function() {
      var stars = new THREE.Geometry();
      for(var i = 0; i < 2000; i++) {
        stars.vertices.push(new THREE.Vector3(
          3000 * Math.random() - 1500,
          3000 * Math.random() - 1500,
          3000 * Math.random() - 1500
        ));
      };

      // var material = new THREE.ParticleBasicMaterial();
      var material = new THREE.ParticleBasicMaterial({
        color: 0xFFFFFF,
        size: 20,
        map: THREE.ImageUtils.loadTexture(
          'textures/particle.png'
        ),
        blending: THREE.AdditiveBlending,
        transparent: true
      });
      var star_system = new THREE.ParticleSystem(stars, material);
      return star_system;
    };

    return Starfield;
});
