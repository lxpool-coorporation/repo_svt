import { Op, QueryInterface, Sequelize } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('utn_prf_profilo', [
      {
        id: 1,
        cod: 'OPR',
        descrizione: 'OPERATORE',
        stato: 'attivo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        cod: 'ATM',
        descrizione: 'AUTOMOBILISTA',
        stato: 'attivo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        cod: 'VRC',
        descrizione: 'VARCO',
        stato: 'attivo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('utn_prf_profilo',{
      id: {[Op.in]: [1,2,3]},
    }, {});
  }
};
