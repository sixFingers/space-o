define([
  '_'
], function(_) {

  var _mousemove_callback;

  function init() {
    this.domElement = document.createElement('div');
    this.domElement.className = 'gui-overlay';
    document.body.appendChild(this.domElement);
  }

  function tooltip(template) {
    if(template !== false) {
      this.domElement.innerHTML = template;
      _mousemove_callback = _.bind(this.mousemove, this);
      document.body.addEventListener('mousemove', _mousemove_callback);
    } else {
      this.domElement.innerHTML = '';
      document.body.removeEventListener('mousemove', _mousemove_callback);
    }
  }

  function mousemove(e) {
    this.domElement.style.left = (e.x + 10) + 'px';
    this.domElement.style.top = (e.y + 10) + 'px';
  }

  function update() {}

  return {
    domElement: null, 
    init: init, 
    tooltip: tooltip,
    mousemove: mousemove,
    update: update
  };
});