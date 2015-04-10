"use strict";
module.exports = function(sequelize, DataTypes) {
  var Amenity = sequelize.define("Amenity", {
    yelp_id: DataTypes.STRING,
    treat: DataTypes.BOOLEAN,
    water: DataTypes.BOOLEAN,
    bed: DataTypes.BOOLEAN,
    cut: DataTypes.BOOLEAN,
    bath: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Amenity;
};