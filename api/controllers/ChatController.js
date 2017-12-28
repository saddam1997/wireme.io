/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  sendMessage: function(req, res) {
    /*if(req.isSocket && req.method === 'POST'){*/

/*      Chat.find({chatId:req.body.chatId}).exec(function (err, record) {
        if(err)
         return res.json({message:'failed to send message',statusCode:400});
        if(record.length==0)
          return res.json({message:'No chat found with this id',statusCode:400});
        if(record.isAccepted==false)
          return res.json({message:'your chat request has not been accepted yet',statusCode:400});*/


/*      sails.sockets.broadcast(33,'NEWMESSAGE', {sender:'email1@emai.com', recipient:'email2@email.ocm', content:'content is content', chatId:33});
      return res.json({
        message: 'message has been sent',
        statusCode: 200,
        data:'done'
      });*/

      Message.create({
            sender: req.body.sender,
            recipient: req.body.recipient,
            content: req.body.content,
            chatId:req.body.chatId
          }).exec(function(err, record) {
            console.log(err);
            if (err)
              return res.json({
                message: 'failed to create message record',
                statusCode: 400
              });
/*
            sails.sockets.broadcast(req.body.chatId,'NEWMESSAGE', {message:'page need to refreshed on this event'});
*/
            return res.json({
              message: 'message has been sent',
              statusCode: 200,
              data:record
            });
          })
            //})
    //}
/*  else if(req.method==='GET'){
      var chatId = req.param('chatId');

      sails.sockets.join(req, 33, function (err) {
        if (err) {
          return res.serverError(err);
        }
        return res.json({
          message: 'Subscribed to a fun room called '+chatId+'!'
        });

      })
    }*/
/*    else {
      res.json({message:'bad request, only socket connections are allowed', statusCode:400});
    }*/
  },


  getChatMessages: function(req, res) {

/*    return res.json({
      statusCode: 200,
      message:'chat retrieved successfully',
      data: 11
    });*/

    Message.find({
      chatId: req.body.chatId
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
      return res.json({
        message: 'chat has been created',
        statusCode: 200,
        data:record
      })

    })
  },


  getAllChatInvites: function (req, res) {
    userId = req.body.email;
    Chat.find({recipient:email}).exec(function (err, record) {
      if(err)
        return res.json({message:'failed to load invites', statusCode:400})
        const filteredChats = record.filter(function (t) {
          return !t.isRejected;
        })
        return res.json({'err':'failed to load data', statusCode:400})
      return res.json({message:'Acceptance is success', statusCode:200, data:filteredChats});
    })
  },


  updateAcceptance: function (req, res) {
    var isAccepted = req.body.isAccepted;
    var chatId = req.body.chatId;
    Chat.update({chatId:chatId}, {isAccepted:isAccepted,isRejected: isAccepted ? false : true }).exec(function (err, record) {
      if(err)
        return res.json({'err':'failed to load data', statusCode:400})
      return res.json({message:'Acceptance is success', statusCode:200, data:record});
    })
  },


  getUserFriends: function (req, res) {
    var userId = req.body.email;

    return res.json({
      message: 'success!',
      data:[{email:'email@gmail.com',chatId:12}, {email:'eml@gmail.com',chatId:13}],
      statusCode:200
    });
    Chat.find({
      or : [
        {sender: userId},
        {recipient: userId}
      ]
    }).exec(function (err, record) {
      if(err)
        return res.json({message:'failed to retrieve user list', statusCode:400})

      var mappedFriends = record.map(function (t) {
        if(t.sender==userId)
          return {email:t.recipient, chatId:t.chatId};
        else return {email:t.sender, chatId:t.chatId};
      });
      return res.json({message:'FriendsList retrieved Successfully', statusCode:200, data:mappedFriends});
    })
  },
};
