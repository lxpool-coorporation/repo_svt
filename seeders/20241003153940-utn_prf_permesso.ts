import { Op, QueryInterface } from 'sequelize';
import {enumPermessoCategoria} from '../../entity/enum/enumPermessoCategoria';
import {enumPermessoTipo} from '../../entity/enum/enumPermessoTipo';
import {enumStato} from '../../entity/enum/enumStato';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('utn_prf_permesso', [
      {
        id: 1,
        cod: 'A001',
        descrizione: 'varco - lettura',
        categoria: enumPermessoCategoria.varco,
        tipo: enumPermessoTipo.lettura,
        stato: enumStato.attivo,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        cod: 'A002',
        descrizione: 'varco - scrittura',
        categoria: enumPermessoCategoria.varco,
        tipo: enumPermessoTipo.scrittura,
        stato: enumStato.attivo,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        cod: 'A003',
        descrizione: 'transito - lettura',
        categoria: enumPermessoCategoria.transito,
        tipo: enumPermessoTipo.lettura,
        stato: enumStato.attivo,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        cod: 'A004',
        descrizione: 'transito - scrittura',
        categoria: enumPermessoCategoria.transito,
        tipo: enumPermessoTipo.scrittura,
        stato: enumStato.attivo,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        cod: 'A005',
        descrizione: 'tratta - lettura',
        categoria: enumPermessoCategoria.tratta,
        tipo: enumPermessoTipo.lettura,
        stato: enumStato.attivo,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        cod: 'A006',
        descrizione: 'tratta - scrittura',
        categoria: enumPermessoCategoria.tratta,
        tipo: enumPermessoTipo.scrittura,
        stato: enumStato.attivo,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        cod: 'A007',
        descrizione: 'veicolo - lettura',
        categoria: enumPermessoCategoria.veicolo,
        tipo: enumPermessoTipo.lettura,
        stato: enumStato.attivo,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 8,
        cod: 'A008',
        descrizione: 'veicolo - scrittura',
        categoria: enumPermessoCategoria.veicolo,
        tipo: enumPermessoTipo.scrittura,
        stato: enumStato.attivo,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 9,
        cod: 'A009',
        descrizione: 'multa - lettura',
        categoria: enumPermessoCategoria.multa,
        tipo: enumPermessoTipo.lettura,
        stato: enumStato.attivo,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('utn_prf_permesso',{
      id: {[Op.in]: [1,2,3,4,5,6,7,8,9]},
    }, {});
  }
};
