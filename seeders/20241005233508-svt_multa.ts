import { QueryInterface, Sequelize } from 'sequelize';
import { enumPolicyTipo } from '../src/entity/enum/enumPolicyTipo';
import { enumMultaStato } from '../src/entity/enum/enumMultaStato';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('svt_multa', [
      {
        id: 1,
        id_transito: 1,
        id_policy: 1,
        tipo_policy: enumPolicyTipo.speed_control,
        id_veicolo: 1,
        id_automobilista: 1,
        is_notturno: false,
        is_recidivo: false,
        stato: enumMultaStato.in_attesa,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        id_transito: 2,
        id_policy: 1,
        tipo_policy: enumPolicyTipo.speed_control,
        id_veicolo: 2,
        id_automobilista: 2,
        is_notturno: false,
        is_recidivo: false,
        stato: enumMultaStato.in_attesa,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('svt_multa',{}, {});
  }
};