import { QueryInterface, Sequelize } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('svt_varco_policy', [
      {
        id_varco: 1,
        id_policy: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_varco: 1,
        id_policy: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_varco: 2,
        id_policy: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_varco: 2,
        id_policy: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('svt_varco_policy',{}, {});
  }
};
