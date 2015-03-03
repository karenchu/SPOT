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