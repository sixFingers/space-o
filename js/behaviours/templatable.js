define([
  '_'
], function(_) {
  var templates = {};

  function cacheTemplates() {
    for(var template in this.templates) {
      this.templates[template] = _.template(this.templates[template]);
    }
  };

  return {
    templates: templates, 
    cacheTemplates: cacheTemplates
  };
});