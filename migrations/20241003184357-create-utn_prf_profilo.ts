
import { QueryInterface, DataTypes } from 'sequelize';
import {enumStato} from '../src/entity/enum/enumStato';
import {enumProfiloTipo} from '../src/entity/enum/enumProfiloTipo';


export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('utn_prf_profilo', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      cod: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descrizione: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      enum_profilo: {
        type: DataTypes.ENUM(...Object.values(enumProfiloTipo)),
        allowNull: false,
      },
      stato: {
        type: DataTypes.ENUM(...Object.values(enumStato)), // Definizione dell'ENUM nel database
        allowNull: false,
        defaultValue: enumStato.attivo,
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
    await queryInterface.dropTable('utn_prf_profilo');
  },
};
