/**
 * Trader.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var bcrypt = require('bcrypt');

module.exports = {
  schema: true,
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    fullName: {
      type: 'string'
    },
    traderId: {
      type: 'string'
    },
    buyPrice: {
      type: 'float',
      defaultsTo: 0
    },
    salePrice: {
      type: 'float',
      defaultsTo: 0
    },
    latitude: {
      type: 'string'
    },
    longitude: {
      type: 'string'
    },
    profileImagePath: {
      type: 'string'
    },
    mobileNumber: {
      type: 'string'
    },
    address: {
      type: 'string'
    },
    volume: {
      type: 'float',
      defaultsTo: 0
    },
    email: {
      type: 'email',
      email: true,
      required: true,
      unique: true
    },
    encryptedPassword: {
      type: 'string'
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.encryptedPassword;
      return obj;
    }
  },
  beforeCreate: function(values, next) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);
      bcrypt.hash(values.password, salt, function(err, hash) {
        if (err) return next(err);
        values.encryptedPassword = hash;
        next();
      })
    })
  },
};