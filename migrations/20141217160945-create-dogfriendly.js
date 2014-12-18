"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("dogfriendlies", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      yelp_id: {
        type: DataTypes.STRING
      },
      dog_friendly: {
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
    migration.dropTable("dogfriendlies").done(done);
  }
};