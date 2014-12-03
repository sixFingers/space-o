define([
  '_'
], function(_) {

  function _getObject(className, attributes) {
    attributes = attributes || {};
    var puppet = {};
    var instance = new className();
    var _instance = new className();
    
    for(var b = 0; b < instance.behaviours.length; b ++) {
      _instance = _.extend(_instance, instance.behaviours[b]);
    };

    _instance = _.extend(_instance, instance);
    return _instance;
  };

  return {
    _getObject: _getObject
  };
});
