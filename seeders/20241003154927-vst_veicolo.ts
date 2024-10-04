import { Op, QueryInterface, Sequelize } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('vst_veicolo', [
      {
        id: 1,
        tipo: 'automobile',
        targa: 'DF334HW',
        stato: 'attivo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        tipo: 'automobile',
        targa: 'AK8972W',
        stato: 'attivo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        tipo: 'camion',
        targa: 'ARM10ST',
        stato: 'attivo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('vst_veicolo',{
      id: {[Op.in]: [1,2,3]},
    }, {});
  }
};