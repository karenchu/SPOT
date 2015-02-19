"use strict";

var bcrypt = require("bcrypt");
var passport = require("passport");
var passportLocal = require("passport-local");

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define("user", {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password_digest: DataTypes.STRING
  }, {
    instanceMethods: {
      checkPassword: function (password) {
        return bcrypt.compareSync(password, this.password_digest);
      }
    },
    classMethods: {
      associate: function(models) {
        // associations be defined here
      },
      findByEmail: function (email) {
        return this.find({
          where: {
            email: email
          }
        });
      },
      encryptPassword: function (password) {
        var salt = bcrypt.genSaltSync(13);
        var hash = bcrypt.hashSync(password, salt);
        return hash;
      },
      createSecure: function (email, password, firstName, lastName, error, success) {
        var hash = this.encryptPassword(password);
        this.create({
          email: email,
          password_digest: hash,
          firstName: firstName,
          lastName: lastName
        })
        .then(function (user) {
          console.log("Yay!")
          success(null, user, {message: "Logged In"});
      },
      function (err) {
        console.log("What?")
        console.log(arguments)
        console.log(err)
        error(null, false, {message: "Error"});
      });
    },
    authenticate: function (email, password, done) {
      this.findByEmail(email)
      .then(function (user) {
        if (user.checkPassword(password)) {
          done(null, user);
        } else {
          done(null, false, {message: "Huh?"});
        }
      },
      function (err) {
        done(err, false)
      })
    }  
  }
});
passport.use(new passportLocal.Strategy (
  {
    usernameField: 'user[email]',
    passwordField: 'user[password]',
    passReqToCallback : true
  },
  function (req, email, password, done) {
    console.log("Authenticating");
    user.authenticate(email, password, done);
  }
  ))
  return user;
};

// // Check for blanks

// function checkblanks(pform1){
//   if(pform1.user[email].value==""){
//     alert("Please enter an email.")
//     pform1.user[email].focus()
//     return false
//   }
//   if(pform1.user[password].value==""){
//     alert("Please enter a password.")
//     pform1.user[password].focus()
//     return false
//   }
//   if(pform1.user[firstName].value==""){
//     alert("Please enter a first name.")
//     pform1.user[firstName].focus()
//     return false
//   }
//   if(pform1.user[lastName].value==""){
//     alert("Please enter a last name.")
//     pform1.user[lastName].focus()
//     return false
//   }
//   return true
// }

// // data validation

// function checkform(pform1){
//   var str=pform1.user[password].value;
//   var email = pform1.user[email].value;
//   // var phone = pform1.phone.value;
//   // var cleanstr = phone.replace(/[().- ]/g, '');
//   var err={};
//   var validemail =/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/;
//   //check required fields
//   //password should be minimum 6 chars but not greater than 10
//   if ((str.length < 6) || (str.length > 10)) {
//     err.message="Invalid password length.";
//     err.field=pform1.user[password];
//   }
//   //validate email
//   if(validemail.test(mail)){
//   }else{
//     err.message="Invalid email.";
//     err.field=pform1.user[email];
//   }
//   //check phone number
//   // if (isNaN(parseInt(cleanstr))) {
//   //   err.message="Invalid phone number";
//   //   err.field=pform1.phone;
//   // }
//   if(err.message)
//   {
//   document.getElementById('divError').innerHTML = err.message;
//     err.field.focus();
//     return false;
//   }
//   return true
// }
