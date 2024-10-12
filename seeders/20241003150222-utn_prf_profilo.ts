import { Op, QueryInterface } from 'sequelize';
import {enumStato} from '../src/entity/enum/enumStato';
import { enumProfiloTipo } from '../src/entity/enum/enumProfiloTipo';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('utn_prf_profilo', [
      {
        id: 1,
        cod: 'OPR',
        descrizione: 'OPERATORE',
        enum_profilo: enumProfiloTipo.operatore,
        stato: enumStato.attivo,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        cod: 'ATM',
        descrizione: 'AUTOMOBILISTA',
        enum_profilo: enumProfiloTipo.automobilista,
        stato: enumStato.attivo,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        cod: 'VRC',
        descrizione: 'VARCO',
        enum_profilo: enumProfiloTipo.varco,
        stato: enumStato.attivo,
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
