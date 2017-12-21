/**
 * Chat.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    chatId:{
      type:'integer',
      autoIncrement:true,
      unique:true
    },
    sender: {
      type: 'string'
    },
    recipient: {
      type:'string'
    },
    owner:{
      type:'string'
    },
    isAccepted:{
      type:'boolean'
    }
  }
};

