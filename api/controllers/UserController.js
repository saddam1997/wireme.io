/**
 * TraderController
 *
 * @description :: Server-side logic for managing traders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt');

var transporter = nodemailer.createTransport({
  service: sails.config.common.supportEmailIdService,
  auth: {
    user: sails.config.common.supportEmailId,
    pass: sails.config.common.supportEmailIdpass
  }
});

module.exports = {


  getAllUsers: function (req, res) {
    User.find().exec(function (err, record) {
      if(err)
        return res.json({'message': 'failed to get users', statusCode:400})
      return res.json({'message':'traders retrieved successfully', statusCode:200, data:record});
    })
  },

  createNewUser: function(req, res) {
    console.log("Enter into createNewUser :: " + req.body.email);
    var userFullName = req.body.fullName;
    var userMobileNumber = req.body.mobileNumber;
    var userEmailAddress = req.body.email;
    var userPassword = req.body.password;
    var userConfirmPassword = req.body.confirmPassword;
    if (!userEmailAddress || !userPassword || !userConfirmPassword || !userFullName || !userMobileNumber) {
      console.log("User Entered invalid parameter ");
      return res.json({
        "message": "Can't be empty!!!",
        statusCode: 400
      });
    }
    if (userPassword !== userConfirmPassword) {
      console.log("Password and confirmPassword doesn\'t match!");
      return res.json({
        "message": 'Password and confirmPassword doesn\'t match!',
        statusCode: 400
      });
    }
    User.findOne({
      email: userEmailAddress
    }, function(err, user){
      if (err) {
        console.log("Error to find trader from database");
        return res.json({
          "message": "Error to find Trader",
          statusCode: 400
        });
      }
      if (user && !user.verifyEmail) {
        console.log("Use email exit But but not verified ");
        return res.json({
          "message": 'Email already exit but not varifed please login and verify',
          statusCode: 400
        });
      }
      if (user) {
        console.log("Use email exit and return ");
        return res.json({
          "message": 'email already exist',
          statusCode: 400
        });
      }
      if (!user) {
        var otpForEmail = Math.floor(Math.random() * 899999 + 100000);
        console.log("otpForEmail :: " + otpForEmail);
        bcrypt.hash(otpForEmail.toString(), 10, function(err, hash) {
          if (err) return next(err);
          var encOtpForEmail = hash;
          var traderObj = {
            fullName: userFullName,
            mobileNumber: userMobileNumber,
            email: userEmailAddress,
            password: userPassword,
            encryptedEmailVerificationOTP: encOtpForEmail
          }
          var mailOptions = {
            from: sails.config.common.supportEmailId,
            to: userEmailAddress,
            subject: 'Please verify email !!!',
            html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
							<html xmlns="http://www.w3.org/1999/xhtml" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
							<head>
								<meta name="viewport" content="width=device-width" />
								<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
								<title>Actionable emails e.g. reset password</title>


								<style type="text/css">
									img {
										max-width: 100%;
									}

									body {
										-webkit-font-smoothing: antialiased;
										-webkit-text-size-adjust: none;
										width: 100% !important;
										height: 100%;
										line-height: 1.6em;
									}

									body {
										background-color: #f6f6f6;
									}

									@media only screen and (max-width: 640px) {
										body {
											padding: 0 !important;
										}
										h1 {
											font-weight: 800 !important;
											margin: 20px 0 5px !important;
										}
										h2 {
											font-weight: 800 !important;
											margin: 20px 0 5px !important;
										}
										h3 {
											font-weight: 800 !important;
											margin: 20px 0 5px !important;
										}
										h4 {
											font-weight: 800 !important;
											margin: 20px 0 5px !important;
										}
										h1 {
											font-size: 22px !important;
										}
										h2 {
											font-size: 18px !important;
										}
										h3 {
											font-size: 16px !important;
										}
										.container {
											padding: 0 !important;
											width: 100% !important;
										}
										.content {
											padding: 0 !important;
										}
										.content-wrap {
											padding: 10px !important;
										}
										.invoice {
											width: 100% !important;
										}
									}
								</style>
							</head>
							<body itemscope itemtype="http://schema.org/EmailMessage" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em; background-color: #f6f6f6; margin: 0;"
								bgcolor="#f6f6f6">

								<table class="body-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6">
									<tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
										<td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
										<td class="container" width="600" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;"
											valign="top">
											<div class="content" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;">
												<table class="main" width="100%" cellpadding="0" cellspacing="0" itemprop="action" itemscope itemtype="http://schema.org/ConfirmAction" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; border: 1px solid #e9e9e9;"
													bgcolor="#fff">
													<tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
														<td class="content-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;" valign="top">
															<meta itemprop="name" content="Confirm Email" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;" />
															<table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
																<tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
																	<td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">

																	</td>
																</tr>
																<tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
																	<td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
																		Dear trader,
																	</td>
																</tr>
																<tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
																	<td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
																		Thank you for signing up with us. Please enter this otp to verify your Email.
																	</td>
																</tr>
																<tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
																	<td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
																		 Your OTP is : ${otpForEmail}
																	</td>
																</tr>
																<tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
																	<td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
																		Kind Regards,
																	</td>
																</tr>
																<tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
																	<td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
																		The BitWireMe Team
																	</td>
																</tr>
															</table>
														</td>
													</tr>
												</table>
												<div class="footer" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; clear: both; color: #999; margin: 0; padding: 20px;">
													<table width="100%" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
														<tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
															<td class="aligncenter content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 12px; vertical-align: top; color: #999; text-align: center; margin: 0; padding: 0 0 20px;" align="center"
																valign="top">Follow <a href="http://twitter.com/bitwireme" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 12px; color: #999; text-decoration: underline; margin: 0;">@Mail_Gun</a> on Twitter.</td>
														</tr>
													</table>
												</div>
											</div>
										</td>
										<td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
									</tr>
								</table>
							</body>
							</html>`
          };
          transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              return res.json({
                "message": "Try after some time!!!",
                statusCode: 400
              });
            } else {
              console.log('Email sent: ' + info.response);
              Trader.create(traderObj)
                .exec(function(err, traderAddDetails) {
                  if (err) {
                    console.log("Error to Create New trader !!!");
                    return res.json({
                      "message": "Error to create New Trader",
                      statusCode: 400
                    });
                  }
                  console.log("Trader Create Succesfully...........");
                  return res.json({
                    "message": "We sent OTP on your email address please verify email!!!",
                    "traderMailId": userEmailAddress,
                    statusCode: 200
                  });
                });
            }
          });
        });
      }
    });
  },
  verifyEmailAddress: function(req, res, next) {
    console.log("Enter into verifyEmailAddress");
    var userMailId = req.param('email');
    var otp = req.param('otp');
    if (!userMailId || !otp) {
      console.log("Can't be empty!");
      return res.json({
        "message": "Can't be empty!",
        statusCode: 400
      });
    }
    User.findOne({
      email: userMailId
    }).exec(function(err, user) {
      if (err) {
        return res.json({
          "message": "Error to find trader",
          statusCode: 401
        });
      }
      if (!user) {
        return res.json({
          "message": "Invalid email!",
          statusCode: 401
        });
      }
      if (user.verifyEmail) {
        return res.json({
          "message": "Email already verified!",
          statusCode: 401
        });
      }
      User.compareEmailVerificationOTP(otp, user, function(err, valid) {
        if (err) {
          console.log("Error to compare otp");
          return res.json({
            "message": "Error to compare otp",
            statusCode: 401
          });
        }
        if (!valid) {
          return res.json({
            "message": "OTP is incorrect!!",
            statusCode: 401
          });
        } else {
          console.log("OTP is verified successfully");
          User.update({
            email: traderMailId
          }, {
            verifyEmail: true
          })
            .exec(function(err, updatedTrader) {
              if (err) {
                return res.json({
                  "message": "Error to update passoword!",
                  statusCode: 401
                });
              }
              console.log("Update passoword successfully!!!");
              res.json(200, {
                "message": "Email verified successfully",
                "traderMailId": userMailId,
                statusCode: 200
              });
            });
        }
      });
    });
  },





  login: function(req, res) {
    console.log("Enter into login!!!" + req.body.email);
    var useremail = req.param('email');
    var password = req.param('password');
    if (!useremail || !password) {
      console.log("email and password required");
      return res.json({
        "message": "Can't be empty!!!",
        statusCode: 401
      });
    }
    console.log("Finding trader....");
    User.findOne({
      email: useremail
    })
      .populateAll()
      .exec(function(err, user) {
        if (err) {
          return res.json({
            "message": "Error to find trader",
            statusCode: 401
          });
        }
        if (!user) {
          return res.json({
            "message": "Please enter registered email!",
            statusCode: 401
          });
        }
        if (!user.verifyEmail) {
          return res.json({
            "message": "We already sent email verification link please verify your email !!",
            statusCode: 401
          });
        }
        console.log("Compare passs");
        User.comparePassword(password, user, function(err, valid) {
          if (err) {
            console.log("Error to compare password");
            return res.json({
              "message": "Error to compare password",
              statusCode: 401
            });
          }
          if (!valid) {
            return res.json({
              "message": "Please enter correct password",
              statusCode: 401
            });
          } else {
            console.log("Trader is valid return trader details !!!");
            //updation of longitude and lattitude code
            User.update({email:useremail}, {lat:req.body.lat, long:req.body.long}).exec(function (err, response) {
              if(err)
                return res.json({message:'failed to update lat long', status:400});
              res.json({
                trader: trader,
                statusCode: 200,
                token: jwToken.issue({
                  id: trader.id
                })
              });
            })
          }
        });
      });
  },
  logout: function(req, res) {
    req.session.destroy()
    res.json({
      message: 'Logout Successfully',
      statusCode: 200
    });
  },
}
