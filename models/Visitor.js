'use strict';
module.exports = (sequelize, DataTypes) => {
  const Visitor = sequelize.define('Visitor', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    // name of the key FOREING we're adding 
    parkadeid: { type: DataTypes.UUID },
    unitid: { type: DataTypes.UUID },
    plate: { type: DataTypes.STRING(25) },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }
  }, {});
  Visitor.associate = function (models) {
    // associations can be defined here
    Visitor.belongsTo(models.Parkade, { foreignKey: 'parkadeid' });
    Visitor.belongsTo(models.Unit, { foreignKey: 'unitid' });
  };
  return Visitor;
};