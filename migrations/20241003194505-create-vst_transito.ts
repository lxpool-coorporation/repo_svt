import { QueryInterface, DataTypes } from 'sequelize';
import {enumTransitoStato} from '../src/entity/enum/enumTransitoStato';
import {enumMeteoTipo} from '../src/entity/enum/enumMeteoTipo';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('svt_transito', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      data_transito: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      speed: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      speed_real: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      id_varco: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'svt_varco', // Nome della tabella a cui si riferisce
          key: 'id',
        },
      },
      meteo: {
        type: DataTypes.ENUM(...Object.values(enumMeteoTipo)), // Definizione dell'ENUM nel database
        allowNull: false,
        defaultValue: enumMeteoTipo.sereno,
      },
      id_veicolo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'svt_veicolo', // Nome della tabella a cui si riferisce
          key: 'id',
        },
      },
      immagine: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      stato: {
        type: DataTypes.ENUM(...Object.values(enumTransitoStato)), // Definizione dell'ENUM nel database
        allowNull: false,
        defaultValue: enumTransitoStato.acquisito,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('svt_transito');
  },
};