import { QueryInterface, DataTypes } from 'sequelize';
import { ormPolicySanction } from '../src/models/svt/ormPolicySanction';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('svt_plc_sanction_speed_control', {
      id_policy_sanction: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'svt_plc_sanction',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      speed_min: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      speed_max: {
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
    await queryInterface.dropTable('svt_plc_sanction_speed_control');
  },
};