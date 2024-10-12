import { QueryInterface } from 'sequelize';
import {enumStato} from '../src/entity/enum/enumStato';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('utn_utente', [
      {
        id: 1,
        identificativo: 'CRMNTU89P26A392R',
        stato: enumStato.attivo,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        identificativo: 'PPTREQ22P36A423B',
        stato: enumStato.attivo,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        identificativo: 'VARCO_1',
        stato: enumStato.attivo,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('utn_utente', {
      identificativo: ['CRMNTU89P26A392R', 'PPTREQ22P36A423B','VARCO_1']
    });
  }
};