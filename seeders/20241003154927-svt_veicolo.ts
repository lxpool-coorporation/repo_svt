import { Op, QueryInterface } from 'sequelize';
import {enumVeicoloStato} from '../src/entity/enum/enumVeicoloStato';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('svt_veicolo', [
      {
        id: 1,
        tipo: 'automobile',
        targa: 'DF334HW',
        stato: enumVeicoloStato.acquisito,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        tipo: 'automobile',
        targa: 'AK8972W',
        stato: enumVeicoloStato.acquisito,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        tipo: 'camion',
        targa: 'ARM10ST',
        stato: enumVeicoloStato.acquisito,
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