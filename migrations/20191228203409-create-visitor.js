'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('visitors', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      parkadeid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Parkades', // name of Target model
          key: 'id',        // key in Target model that we're referencing
        }
      },
      unitid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Units', // name of Target model
          key: 'id',        // key in Target model that we're referencing
        }
      },
      plate: {
        type: Sequelize.STRING(25)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('visitors');
  }
};