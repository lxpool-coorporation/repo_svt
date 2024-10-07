import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('svt_multa_speed_control', {
      id_multa: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'svt_multa',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      speed: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      speed_real: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      speed_limit: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      speed_delta: {
        type: DataTypes.INTEGER,
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
    await queryInterface.dropTable('svt_multa_speed_control');
  },
};