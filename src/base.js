/* global Backbone */

////////////////////////////////////////////////////////////////////////////////

Backbone.Model.Base = Backbone.Model.extend({
  attributeTypes: {},

  get: function(attr, opts) {
    if (opts.recursive === true) {
      const segs = attr.split(/(\[|\]|\.)+/)
      attr = segs.shift()
      const val = this.get(attr, { recursive: false })

      let isModel = false
      if (this.attributeTypes.hasOwnProperty(attr)
        && this.attributeTypes[attr]
        && typeof this.attributeTypes[attr] === 'function'
        && ((isModel = this.attributeTypes[attr] === Backbone.Model.Base
        || this.attributeTypes[attr].prototype instanceof Backbone.Model.Base)
        || this.attributeTypes[attr] === Backbone.Collection
        || this.attributeTypes[attr].prototype instanceof Backbone.Collection)
        && val instanceof this.attributeTypes[attr]) {

          if (isModel) {
            if (segs.length > 0) {
              return val.get(segs.join('.'), { recursive: true })
            }
          } else {
            if (segs.length > 0) {
              const index = +segs.shift()
              if (segs.length > 0) {
                return val.at(index).get(segs.join('.'), { recursive: true })
              }
            }
          }
      }

      return val
    } else {
      return Backbone.Model.prototype.get.call(this, attr)
    }
  },

  set: function(attr, opts) {
    if (typeof attr === 'string') {
      attr = { [attr]: arguments[1] }
      opts = arguments[2]
    }

    for (const k in this.attributeTypes) {
      if (this.attributeTypes.hasOwnProperty(k) && this.attributeTypes[k]
        && attr.hasOwnProperty(k) && attr[k]) {

        if (typeof this.attributeTypes[k] === 'string'
          && typeof attr[k] !== this.attributeTypes[k]) {
          // Primitive types.

          switch(this.attributeTypes[k]) {
            case 'boolean': {
              const args = Array.isArray(attr[k]) ? attr[k] : [attr[k]]
              attr[k] = (new String(...args)).valueOf()
            }
            break

            case 'number': {
              const args = Array.isArray(attr[k]) ? attr[k] : [attr[k]]
              attr[k] = (new String(...args)).valueOf()
            }
            break

            case 'string': {
              const args = Array.isArray(attr[k]) ? attr[k] : [attr[k]]
              attr[k] = (new String(...args)).valueOf()
            }
            break
          }
        } else if (typeof this.attributeTypes[k] === 'function'
          && !(attr[k] instanceof this.attributeTypes[k])) {
          // Object types.

          const args = Array.isArray(attr[k]) ? attr[k] : [attr[k]]
          attr[k] = new this.attributeTypes[k](...args)
        }
      }
    }

    return Backbone.Model.prototype.set.call(this, attr, opts)
  },

  toJSON: function(opts) {
    const json = Backbone.Model.prototype.toJSON.call(this, opts)

    if (opts.deep === true) {
      for (const k in this.attributeTypes) {
        const val = this.get(k)
        if (this.attributeTypes.hasOwnProperty(k) && this.attributeTypes[k]
          && typeof this.attributeTypes[k] === 'function'
          && (this.attributeTypes[k] === Backbone.Model
          || this.attributeTypes[k].prototype instanceof Backbone.Model
          || this.attributeTypes[k] === Backbone.Collection
          || this.attributeTypes[k].prototype instanceof Backbone.Collection)
          && val instanceof this.attributeTypes[k]) {

          json[k] = val.toJSON()
        }
      }
    }

    return json
  }
})

////////////////////////////////////////////////////////////////////////////////

Backbone.Collection.Base = Backbone.Collection.extend({
  model: Backbone.Model.Base
})

////////////////////////////////////////////////////////////////////////////////

Backbone.View.Base = Backbone.View.extend({})
