define([
  '_',
  'core/controls'
], function(_, controls) {

  var domEvents = {};

  function bindDomEvents() {
    for(var eventName in this.domEvents) {
      var _event = this.domEvents[eventName];
      controls.domEvents.addEventListener(this.displayObject, eventName, _.bind(_event, this));
    }
  };

  return {
    domEvents: domEvents,
    bindDomEvents: bindDomEvents
  };
});