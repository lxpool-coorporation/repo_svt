import { QueryInterface, Sequelize } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('svt_multa_speed_control', [
      {
        id_multa: 1,
        speed: 140,
        speed_real: 146,
        speed_limit: 130,
        speed_delta: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_multa: 2,
        speed: 132,
        speed_real: 137,
        speed_limit: 130,
        speed_delta: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('svt_multa_speed_control',{}, {});
  }
};