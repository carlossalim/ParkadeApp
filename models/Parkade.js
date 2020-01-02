'use strict';
module.exports = (sequelize, DataTypes) => {
  const Parkade = sequelize.define('Parkade', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {});
  Parkade.associate = function (models) {
    // associations can be defined here
    Parkade.hasMany(models.Unit)
  };
  return Parkade;
};