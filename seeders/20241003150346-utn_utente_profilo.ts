import { Op, QueryInterface, Sequelize } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('utn_utente_profilo', [
      {
        id_utente: 1,
        id_profilo: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_utente: 1,
        id_profilo: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_utente: 2,
        id_profilo: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('utn_utente_profilo',{
      [Op.or]: [
        { id_utente: 1, id_profilo: 1 },
        { id_utente: 1, id_profilo: 2 },
        { id_utente: 2, id_profilo: 1 }
      ]
    }, {});
  }
};
