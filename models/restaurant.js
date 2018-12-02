'use strict';
module.exports = (sequelize, DataTypes) => {
  const Restaurant = sequelize.define('Restaurant', {
    name: DataTypes.STRING,
    tel: DataTypes.STRING,
    address: DataTypes.STRING,
    opening_hours: DataTypes.STRING,
    image: DataTypes.STRING,
    description: DataTypes.TEXT,
  }, {});
  Restaurant.associate = function(models) {
    // associations can be defined here
    Restaurant.belongsTo(models.Category);
  };
  return Restaurant;
};
