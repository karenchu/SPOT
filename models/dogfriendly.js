"use strict";

module.exports = function(sequelize, DataTypes) {
  var dogfriendly = sequelize.define("dogfriendly", {
    yelp_id: DataTypes.STRING,
    dog_friendly: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return dogfriendly;
};
