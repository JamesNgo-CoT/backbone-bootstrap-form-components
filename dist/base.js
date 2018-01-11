'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* global Backbone */

////////////////////////////////////////////////////////////////////////////////

Backbone.Model.Base = Backbone.Model.extend({
  attributeTypes: {},

  get: function get(attr, opts) {
    if (opts.recursive === true) {
      var segs = attr.split(/(\[|\]|\.)+/);
      attr = segs.shift();
      var val = this.get(attr, { recursive: false });

      var isModel = false;
      if (this.attributeTypes.hasOwnProperty(attr) && this.attributeTypes[attr] && typeof this.attributeTypes[attr] === 'function' && ((isModel = this.attributeTypes[attr] === Backbone.Model.Base || this.attributeTypes[attr].prototype instanceof Backbone.Model.Base) || this.attributeTypes[attr] === Backbone.Collection || this.attributeTypes[attr].prototype instanceof Backbone.Collection) && val instanceof this.attributeTypes[attr]) {

        if (isModel) {
          if (segs.length > 0) {
            return val.get(segs.join('.'), { recursive: true });
          }
        } else {
          if (segs.length > 0) {
            var index = +segs.shift();
            if (segs.length > 0) {
              return val.at(index).get(segs.join('.'), { recursive: true });
            }
          }
        }
      }

      return val;
    } else {
      return Backbone.Model.prototype.get.call(this, attr);
    }
  },

  set: function set(attr, opts) {
    if (typeof attr === 'string') {
      attr = _defineProperty({}, attr, arguments[1]);
      opts = arguments[2];
    }

    for (var k in this.attributeTypes) {
      if (this.attributeTypes.hasOwnProperty(k) && this.attributeTypes[k] && attr.hasOwnProperty(k) && attr[k]) {

        if (typeof this.attributeTypes[k] === 'string' && _typeof(attr[k]) !== this.attributeTypes[k]) {
          // Primitive types.

          switch (this.attributeTypes[k]) {
            case 'boolean':
              {
                var args = Array.isArray(attr[k]) ? attr[k] : [attr[k]];
                attr[k] = new (Function.prototype.bind.apply(String, [null].concat(_toConsumableArray(args))))().valueOf();
              }
              break;

            case 'number':
              {
                var _args = Array.isArray(attr[k]) ? attr[k] : [attr[k]];
                attr[k] = new (Function.prototype.bind.apply(String, [null].concat(_toConsumableArray(_args))))().valueOf();
              }
              break;

            case 'string':
              {
                var _args2 = Array.isArray(attr[k]) ? attr[k] : [attr[k]];
                attr[k] = new (Function.prototype.bind.apply(String, [null].concat(_toConsumableArray(_args2))))().valueOf();
              }
              break;
          }
        } else if (typeof this.attributeTypes[k] === 'function' && !(attr[k] instanceof this.attributeTypes[k])) {
          // Object types.

          var _args3 = Array.isArray(attr[k]) ? attr[k] : [attr[k]];
          attr[k] = new (Function.prototype.bind.apply(this.attributeTypes[k], [null].concat(_toConsumableArray(_args3))))();
        }
      }
    }

    return Backbone.Model.prototype.set.call(this, attr, opts);
  },

  toJSON: function toJSON(opts) {
    var json = Backbone.Model.prototype.toJSON.call(this, opts);

    if (opts.deep === true) {
      for (var k in this.attributeTypes) {
        var val = this.get(k);
        if (this.attributeTypes.hasOwnProperty(k) && this.attributeTypes[k] && typeof this.attributeTypes[k] === 'function' && (this.attributeTypes[k] === Backbone.Model || this.attributeTypes[k].prototype instanceof Backbone.Model || this.attributeTypes[k] === Backbone.Collection || this.attributeTypes[k].prototype instanceof Backbone.Collection) && val instanceof this.attributeTypes[k]) {

          json[k] = val.toJSON();
        }
      }
    }

    return json;
  }
});

////////////////////////////////////////////////////////////////////////////////

Backbone.Collection.Base = Backbone.Collection.extend({
  model: Backbone.Model.Base
});

////////////////////////////////////////////////////////////////////////////////

Backbone.View.Base = Backbone.View.extend({});