'use strict';
module.exports = (sequelize, DataTypes) => {
  const Unit = sequelize.define('Unit', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    // name of the key FOREING we're adding 
    parkadeid: {
      type: DataTypes.UUID
      // references: {
      //   model: 'Parkades', // name of Target model
      //   key: 'id', // key in Target model that we're referencing
      // }
    },
    ownerName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    spots: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Unit.associate = function (models) {
    // associations can be defined here
    Unit.belongsTo(models.Parkade, { foreignKey: 'parkadeid' });
    Unit.hasMany(models.Visitor);
  };
  return Unit;
};