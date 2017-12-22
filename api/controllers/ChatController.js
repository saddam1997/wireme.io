/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var util = require('util');

module.exports = {

  getChatMessages: function(req, res) {
    const chatId = req.body.chatId;
    Message.find({
      chatId: chatId
    }).exec(function(err, records) {
      if (err)
        return res.json({
          status: 400,
          message: 'failed to get data'
        });
      return res.json({
        status: 200,
        data: records
      });
    });
  },

  getUserChats: function(req, res) {
    const email = req.body.email;
    Chat.find({
      sender: email
    }).exec(function(err, records) {
      if (err)
        return res.json({
          status: 400,
          message: 'failed to get data'
        });
      return res.json({
        status: 200,
        data: records
      });
    });
  },

  sendMessage: function(req, res) {
    const sender = req.body.sender;
    const recipient = req.body.recipient;
    const content = req.body.content;
    //ChatId is autoincrement
    const chatId = req.body.chatId;
    Message.create({
      sender: sender,
      recipient: recipient,
      content: content,
      chatId: chatId
    }).exec(function(err, record) {
      if (err)
        return res.json({
          message: 'failed to create message record',
          error: err,
          status: 400
        })
      return res.json({
        message: 'message has been sent',
        status: 200
      })
    })
  },
  createChat: function(req, res) {
    const senderId = req.body.sender;
    const recipientId = req.body.recipient;

    Chat.create({
      "sender": senderId,
      "recipient": recipientId
    }).exec(function(err, record) {
      if (err)
        return res.json({
          message: 'failed to create chat record',
          error: err,
          status: 400
        })
      return res.json({
        message: 'chat has been created',
        status: 200
      })

    })
  },
  updateAcceptance: function (req, res) {
    var isAccepted = req.body.isAccepted;
    var chatId = req.body.chatId;
    Chat.update({"chatId":chatId}, {"isAccepted":isAccepted}).exec(function (err, record) {
      if(err)
        return res.json({'err':err, status:400})
      return res.json({message:'Acceptance is success', status:200, data:record});
    })
  },

  getUserFriends: function (req, res) {
    var userId = req.body.email;
    Chat.find({
      or : [
        {sender: userId},
        {recipient: userId}
      ]
    }).exec(function (err, record) {
      if(err)
        return res.json({'err':err,'message':'failed to retrieve user list', status:400})

      var mappedFriends = record.map(function (t) {
        if(t.sender==userId)
          return {email:t.recipient, chatId:t.chatId};
        else return {email:t.sender, chatId:t.chatId};
      });

      return res.json({message:'FriendsList retrieved Successfully', status:200, data:mappedFriends});
    })
  },
};
