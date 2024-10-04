import { Op, QueryInterface, Sequelize } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('utn_prf_permesso', [
      {
        id: 1,
        cod: 'A001',
        descrizione: 'varco - lettura',
        categoria: 'varco',
        tipo: 'lettura',
        stato: 'attivo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        cod: 'A002',
        descrizione: 'transito - lettura',
        categoria: 'transito',
        tipo: 'lettura',
        stato: 'attivo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        cod: 'A003',
        descrizione: 'transito - scrittura',
        categoria: 'transito',
        tipo: 'scrittura',
        stato: 'attivo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('utn_prf_permesso',{
      id: {[Op.in]: [1,2,3]},
    }, {});
  }
};
