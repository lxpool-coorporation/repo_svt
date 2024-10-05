import { QueryInterface, DataTypes } from 'sequelize';
import { ormPolicySanction } from '../src/models/vst/ormPolicySanction';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('vst_plc_sanction_speed_control', {
      id_policy_sanction: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: ormPolicySanction,
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
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('vst_plc_sanction_speed_control');
  },
};