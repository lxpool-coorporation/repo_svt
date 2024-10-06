import { QueryInterface } from 'sequelize';
import { enumStato } from '../src/entity/enum/enumStato';
import { enumPolicyTipo } from '../src/entity/enum/enumPolicyTipo';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('svt_plc_policy', [
      {
        id: 1,
        cod: 'PLC001',
        descrizione: 'limite ordinario: 130 km/h',
        tipo: enumPolicyTipo.speed_control,
        stato: enumStato.attivo,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        cod: 'PLC002',
        descrizione: 'limite su bagnato: 90 km/h',
        tipo: enumPolicyTipo.speed_control,
        stato: enumStato.attivo,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('svt_plc_policy',{}, {});
  }
};