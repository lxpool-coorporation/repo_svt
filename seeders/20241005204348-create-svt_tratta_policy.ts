import { Op, QueryInterface, Sequelize } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('svt_tratta_policy', [
      {
        id_tratta: 1,
        id_policy: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_tratta: 1,
        id_policy: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_tratta: 2,
        id_policy: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_tratta: 2,
        id_policy: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('svt_tratta_policy',{}, {});
  }
};
