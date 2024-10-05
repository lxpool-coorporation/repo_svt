import { Op, QueryInterface, Sequelize } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('vst_plc_sanction_speed_control', [
      {
        id_policy_sanction: 1,
        speed_min: 0,
        speed_max: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_policy_sanction: 2,
        speed_min: 10,
        speed_max: 40,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_policy_sanction: 3,
        speed_min: 40,
        speed_max: 60,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_policy_sanction: 4,
        speed_min: 60,
        speed_max: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('vst_plc_sanction_speed_control',{}, {});
  }
};