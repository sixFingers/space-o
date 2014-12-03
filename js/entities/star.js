define([
  'behaviours/displayable',
  'behaviours/domEventable',
  'behaviours/templatable',
  'behaviours/star', 
  'components/gui', 
  'text!templates/stars/tooltip.html'
], function(displayable, domEventable, templatable, starBehaviour, gui, tooltipHTML) {

  function Star() {
    this.type = 'star';
    this.behaviours = [displayable, domEventable, templatable, starBehaviour];
    
    this.domEvents = {
      'mouseover': this.mouseover,
      'mouseout': this.mouseout
    };

    this.templates = {
      tooltip: tooltipHTML
    };
  };

  Star.prototype.init = function() {
    this.displayObject = this.createMesh();
    this.cacheTemplates();
    this.bindDomEvents();
  }

  Star.prototype.createMesh = function() {
    var geometry = new THREE.SphereGeometry(1, 16, 8);
    var material = new THREE.MeshNormalMaterial();
    var mesh = new THREE.Mesh(geometry, material);
    // mesh.scale.set(.1, .1, .1);
    mesh.name = 'globe';
    mesh.owner = this;
    return mesh;
  }

  Star.prototype.mouseover = function(e) {
    var template = this.templates.tooltip(this);
    gui.tooltip(template);
  };

  Star.prototype.mouseout = function(e) {
    gui.tooltip(false);
  };

  return Star;
});
