import { Op, QueryInterface, Sequelize } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('vst_varco', [
      {
        id: 1,
        cod: 'V001',
        descrizione: 'Piacenza Nord',
        stato: 'attivo',
        latitudine: 45.0833,
        longitudine: 9.6833,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        cod: 'V002',
        descrizione: 'Piacenza Sud',
        stato: 'attivo',
        latitudine: 44.4872,
        longitudine: 11.3925,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        cod: 'V001',
        descrizione: 'Bologna San Lazzaro',
        stato: 'attivo',
        latitudine: 45.0833,
        longitudine: 9.6833,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        cod: 'V002',
        descrizione: 'Imola',
        stato: 'attivo',
        latitudine: 44.4872,
        longitudine: 11.3925,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        cod: 'V005',
        descrizione: 'Bergamo',
        stato: 'attivo',
        latitudine: 45.6960,
        longitudine: 9.6673,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        cod: 'V006',
        descrizione: 'Brescia Ovest',
        stato: 'attivo',
        latitudine: 45.5630,
        longitudine: 10.1677,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        cod: 'V007',
        descrizione: 'Tivoli',
        stato: 'attivo',
        latitudine: 41.9601,
        longitudine: 12.7896,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 8,
        cod: 'V008',
        descrizione: 'Castel Madama',
        stato: 'attivo',
        latitudine: 41.9367,
        longitudine: 12.8345,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('vst_varco',{
      id: {[Op.in]: [1,2,3,4,5,6,7,8]},
    }, {});
  }
};