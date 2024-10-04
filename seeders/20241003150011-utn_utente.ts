import { QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('utn_utente', [
      {
        id: 1,
        identificativo: 'CRMNTU89P26A392R',
        stato: 'attivo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        identificativo: 'PPTREQ22P36A423B',
        stato: 'attivo',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('utn_utente', {
      identificativo: ['CRMNTU89P26A392R', 'PPTREQ22P36A423B']
    });
  }
};