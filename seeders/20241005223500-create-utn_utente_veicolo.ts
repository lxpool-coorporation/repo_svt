import { QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('utn_utente_veicolo', [
      {
        id_utente: 1,
        id_veicolo: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_utente: 1,
        id_veicolo: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_utente: 2,
        id_veicolo: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('utn_utente_veicolo',{}, {});
  }
};
