import { QueryInterface } from 'sequelize';
import { enumStato } from '../../entity/enum/enumStato';
import { enumPolicyTipo } from '../../entity/enum/enumPolicyTipo';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('svt_plc_sanction', [
      {
        id: 1,
        tipo_policy: enumPolicyTipo.speed_control,
        cod: 'PS001',
        descrizione: 'fino 10 km/h',
        costo_min: 42,
        costo_max: 173,
        costo_punti_patente: 0,
        stato: enumStato.attivo,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        tipo_policy: enumPolicyTipo.speed_control,
        cod: 'PS002',
        descrizione: 'tra 10 e 40 km/h',
        costo_min: 173,
        costo_max: 694,
        costo_punti_patente: 3,
        stato: enumStato.attivo,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        tipo_policy: enumPolicyTipo.speed_control,
        cod: 'PS003',
        descrizione: 'tra 40 e 60 km/h',
        costo_min: 543,
        costo_max: 2170,
        costo_punti_patente: 6,
        stato: enumStato.attivo,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        tipo_policy: enumPolicyTipo.speed_control,
        cod: 'PS003',
        descrizione: 'oltre 60 km/h',
        costo_min: 845,
        costo_max: 3382,
        costo_punti_patente: 10,
        stato: enumStato.attivo,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('svt_plc_sanction',{}, {});
  }
};