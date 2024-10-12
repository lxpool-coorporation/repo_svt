import { QueryInterface } from 'sequelize';
import { enumVeicoloTipo } from '../../entity/enum/enumVeicoloTipo';
import { enumMeteoTipo } from '../../entity/enum/enumMeteoTipo';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('svt_plc_speed_control', [
      {
        id_policy: 1,
        meteo: enumMeteoTipo.sereno,
        veicolo: enumVeicoloTipo.autoveicoli,
        speed_limit: 130,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_policy: 2,
        meteo: enumMeteoTipo.pioggia,
        veicolo: enumVeicoloTipo.autoveicoli,
        speed_limit: 90,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('svt_plc_speed_control',{}, {});
  }
};