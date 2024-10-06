import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('svt_multa', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      id_transito: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'svt_transito', // Nome della tabella a cui si riferisce
          key: 'id',
        },
      },
      id_policy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'svt_plc_policy', // Nome della tabella a cui si riferisce
          key: 'id',
        },
      },
      speed_delta: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      path_bollettino: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('svt_multa');
  },
};