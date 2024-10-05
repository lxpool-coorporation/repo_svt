import { Op, QueryInterface } from 'sequelize';
import {enumStato} from '../src/entity/enum/enumStato';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('svt_veicolo', [
      {
        id: 1,
        tipo: 'automobile',
        targa: 'DF334HW',
        stato: enumStato.attivo,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        tipo: 'automobile',
        targa: 'AK8972W',
        stato: enumStato.attivo,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        tipo: 'camion',
        targa: 'ARM10ST',
        stato: enumStato.attivo,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('svt_veicolo',{
      id: {[Op.in]: [1,2,3]},
    }, {});
  }
};