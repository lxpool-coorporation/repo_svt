import { Op, QueryInterface, Sequelize } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('utn_profilo_permesso', [
      {
        id_profilo: 1,
        id_permesso: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_profilo: 1,
        id_permesso: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_profilo: 1,
        id_permesso: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_profilo: 1,
        id_permesso: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_profilo: 1,
        id_permesso: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_profilo: 1,
        id_permesso: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_profilo: 1,
        id_permesso: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_profilo: 1,
        id_permesso: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_profilo: 2,
        id_permesso: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('utn_profilo_permesso',{}, {});
  }
};