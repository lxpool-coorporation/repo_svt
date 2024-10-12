import { QueryInterface, Sequelize } from 'sequelize';
import { enumMeteoTipo } from '../src/entity/enum/enumMeteoTipo';
import { enumTransitoStato } from '../src/entity/enum/enumTransitoStato';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('svt_transito', [
      {
        id: 1,
        data_transito: '2024-12-12 15:01',
        speed: 140,
        speed_real: 144,
        id_varco: 1,
        meteo: enumMeteoTipo.sereno,
        id_veicolo: 1,
        path_immagine: 'data/immagine_1.jpg',
        stato: enumTransitoStato.in_attesa,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        data_transito: '2024-12-12 15:07',
        speed: 120,
        speed_real: 122,
        id_varco: 2,
        meteo: enumMeteoTipo.pioggia,
        id_veicolo: 1,
        path_immagine: 'data/immagine_2.jpg',
        stato: enumTransitoStato.in_attesa,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('svt_transito',{}, {});
  }
};