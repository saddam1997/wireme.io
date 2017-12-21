/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var util = require('util');

module.exports = {
  getChatMessages: function (req, res) {
    const chatId = req.body.chatId;
    Message.find(chatId).exec(function (err, records) {
      if(err)
        return res.json({status:400, message: 'failed to get data'});
      return res.json({status:200, data: records});
    });
  },

  getUserChats:function (req, res) {
    const email = req.body.email;
    Chat.find(email).exec(function (err, records) {
      if(err)
        return res.json({status:400, message: 'failed to get data'});
      return res.json({status:200, data: records});
    });
  },
  sendMessage: function (req, res) {
    const sender = req.body.sender;
    const recipient = req.body.recipient;
    const content = req.body.content;
    const chatId = req.body.chatId;
    Message.create({sender:sender,recipient:recipient, content:content, chatId:chatId}).exec(function (err, record) {
      if(err)
        return res.json({message: 'failed to create message record',error:err, status:400 })
      return res.json({message:'message has been sent', status:200})
    })
  },
  createChat: function (req, res) {
    const senderId = req.body.sender;
    const recipientId = req.body.recipient;

    Chat.create({"sender":"sender23"}).exec(function (err, record) {
      if(err)
        return res.json({message: 'failed to create chat record',error:err, status:400 })
      return res.json({message:'chat has been created', status:200})

    })
  },

};

