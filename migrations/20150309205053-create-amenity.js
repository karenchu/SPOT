"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Amenities", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      yelp_id: {
        type: DataTypes.STRING
      },
      treat: {
        type: DataTypes.BOOLEAN
      },
      water: {
        type: DataTypes.BOOLEAN
      },
      bed: {
        type: DataTypes.BOOLEAN
      },
      cut: {
        type: DataTypes.BOOLEAN
      },
      bath: {
        type: DataTypes.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("Amenities").done(done);
  }
};