define([
  'behaviours/displayable',
], function(displayable) {
  
  function Skybox() {
    this.behaviours = [displayable];
  };

  Skybox.prototype.init = function() {
    this.displayObject = this.createMesh();
  }

  Skybox.prototype.createMesh = function() {
    var geometry = new THREE.SphereGeometry(3000, 60, 40);
    var texture = new THREE.ImageUtils.loadTexture( '/textures/skybox.jpg' );
    var uniforms = {
      texture: { type: 't', value: texture }
    };

    var material = new THREE.ShaderMaterial( {
      uniforms:       uniforms,
      vertexShader:   document.getElementById('sky-vertex').textContent,
      fragmentShader: document.getElementById('sky-fragment').textContent
    });

    var mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(-1, 1, 1);
    mesh.eulerOrder = 'XZY';
    mesh.rotation.z = Math.PI/2;
    mesh.rotation.x = Math.PI;
    mesh.renderDepth = 1000.0;
    mesh.name = 'skybox';
    mesh.owner = this;
    window.skyBox = mesh;
    return mesh;
  };

  return Skybox;
});