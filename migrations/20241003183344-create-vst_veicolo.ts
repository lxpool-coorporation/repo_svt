import { QueryInterface, DataTypes } from 'sequelize';
import {enumStato} from '../src/entity/enum/enumStato';
import {enumVeicoloTipo} from '../src/entity/enum/enumVeicoloTipo';



export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('vst_veicolo', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      tipo: {
        type: DataTypes.ENUM(...Object.values(enumVeicoloTipo )), // Definizione dell'ENUM nel database
        allowNull: false,
        defaultValue: enumVeicoloTipo.autoveicoli,
      },
      targa: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      stato: {
        type: DataTypes.ENUM(...Object.values(enumStato)), // Definizione dell'ENUM nel database
        allowNull: false,
        defaultValue: enumStato.attivo  ,
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
    await queryInterface.dropTable('vst_veicolo');
  },
};