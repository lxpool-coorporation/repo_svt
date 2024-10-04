

import { QueryInterface, DataTypes } from 'sequelize';
import {enumPermessoCategoria} from '../src/entity/enum/enumPermessoCategoria';
import {enumPermessoTipo} from '../src/entity/enum/enumPermessoTipo';
import {enumStato} from '../src/entity/enum/enumStato';


export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('utn_prf_permesso', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      tipo: {
        type: DataTypes.ENUM(...Object.values(enumPermessoTipo)), // Definizione dell'ENUM nel database
        allowNull: false,
        defaultValue: enumPermessoTipo.lettura,
      },
      categoria: {
        type: DataTypes.ENUM(...Object.values(enumPermessoCategoria)), // Definizione dell'ENUM nel database
        allowNull: false,
        defaultValue: enumPermessoCategoria.varco,
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
    await queryInterface.dropTable('utn_prf_permesso');
  },
};