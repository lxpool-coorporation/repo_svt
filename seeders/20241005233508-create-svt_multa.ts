import { QueryInterface, Sequelize } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('svt_multa', [
      {
        id: 1,
        id_transito: 1,
        id_policy: 1,
        speed_delta: 17,
        path_bollettino: "/data/bollettino_1.pdf",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        id_transito: 2,
        id_policy: 1,
        speed_delta: 10,
        path_bollettino: 'bollettino_2.pdf',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('svt_multa',{}, {});
  }
};