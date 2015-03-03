"use strict";

module.exports = function(sequelize, DataTypes) {
  var Rating = sequelize.define("Rating", {
    user_id: DataTypes.INTEGER,
    yelp_id: DataTypes.STRING,
    rating: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return Rating;
};