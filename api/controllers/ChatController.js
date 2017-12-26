/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */



/*
var currentChats = [];
var _ = require('underscore');
*/



module.exports = {
  sendMessage: function(req, res) {
    if(req.isSocket && req.method === 'POST'){
      Chat.find({chatId:req.body.chatId}).exec(function (err, record) {
        if(err)
         return res.json({message:'failed to send message',statusCode:400});
        if(record.length==0)
          return res.json({message:'No chat found with this id',statusCode:400});
        if(record.isAccepted==false)
          return res.json({message:'your chat request has not been accepted yet',statusCode:400});
          Message.create({
            sender: sender,
            recipient: recipient,
            content: req.body.content,
            chatId: req.body.chatId
          }).exec(function(err, record) {
            console.log(err);
            if (err)
              return res.json({
                message: 'failed to create message record',
                statusCode: 400
              });
            sails.sockets.broadcast(req.body.chatId,'NEWMESSAGE', {message:'page need to refreshed on this event'});
            return res.json({
              message: 'message has been sent',
              statusCode: 200,
              data:record
            });
          })
      })
    }
  else if(req.method==='GET'){
      var chatId = req.param('chatId');

      sails.sockets.join(req, chatId, function (err) {
        if (err) {
          return res.serverError(err);
        }
        return res.json({
          message: 'Subscribed to a fun room called '+chatId+'!'
        });

      })
    }
    else {
      res.json({message:'bad request, only socket connections are allowed', statusCode:400});
    }
  },


  getChatMessages: function(req, res) {
    const chatId = req.body.chatId;
    Message.find({
      chatId: chatId
    }).exec(function(err, records) {
      if (err)
        return res.json({
          statusCode: 400,
          message: 'failed to get data'
        });
      return res.json({
        statusCode: 200,
        message:'chat retrieved successfully',
        data: records
      });
    });
  },


  /*
  getUserChats: function(req, res) {
    const email = req.body.email;
    Chat.find({
      sender: email
    }).exec(function(err, records) {
      if (err)
        return res.json({
          statusCode: 400,
          message: 'failed to get data'
        });
      return res.json({
        status: 200,
        data: records
      });
    });
  },*/


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
          statusCode: 400
        })
      console.log("this is what we want",record);
      return res.json({
        message: 'chat has been created',
        statusCode: 200,
      })

    })
  },


  updateAcceptance: function (req, res) {
    var isAccepted = req.body.isAccepted;
    var chatId = req.body.chatId;
    Chat.update({"chatId":chatId}, {"isAccepted":isAccepted}).exec(function (err, record) {
      if(err)
        return res.json({'err':err, statusCode:400})
      return res.json({message:'Acceptance is success', statusCode:200, data:record});
    })
  },


  getUserFriends: function (req, res) {
    var userId = req.body.email;


    /*

    return res.json({
      message: 'success!',
      data:[{email:'email@email.com',chatId:'12'}, {email:'eml@eml.com',chatId:'13'}],
      statusCode:200
    });

*/

    Chat.find({
      or : [
        {sender: userId},
        {recipient: userId}
      ]
    }).exec(function (err, record) {
      if(err)
        return res.json({'err':err,'message':'failed to retrieve user list', statusCode:400})

      var mappedFriends = record.map(function (t) {
        if(t.sender==userId)
          return {email:t.recipient, chatId:t.chatId};
        else return {email:t.sender, chatId:t.chatId};
      });
      return res.json({message:'FriendsList retrieved Successfully', statusCode:200, data:mappedFriends});
    })
  },
};
