import { Op, QueryInterface, Sequelize } from 'sequelize';
import {enumStato} from '../src/entity/enum/enumStato';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('svt_tratta', [
      {
        id: 1,
        cod: 'T01',
        descrizione: 'A1 Milano - Napoli (Zona Piacenza)',
        stato: enumStato.attivo,
        id_varco_ingresso: 1,
        id_varco_uscita: 2,
        distanza: 18,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        cod: 'T02',
        descrizione: 'A14 Bologna - Taranto (Zona Imola)',
        stato: enumStato.attivo,
        id_varco_ingresso: 3,
        id_varco_uscita: 4,
        distanza: 32,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        cod: 'T03',
        descrizione: 'A4 Torino - Trieste (Zona Bergamo)',
        stato: enumStato.attivo,
        id_varco_ingresso: 5,
        id_varco_uscita: 6,
        distanza: 40,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        cod: 'T03',
        descrizione: 'A24 Roma - L\'Aquila (Zona Tivoli)',
        stato: enumStato.attivo,
        id_varco_ingresso: 7,
        id_varco_uscita: 8,
        distanza: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('svt_tratta',{
      id: {[Op.in]: [1,2,3,4]},
    }, {});
  }
};