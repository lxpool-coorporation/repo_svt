import { QueryInterface, DataTypes } from 'sequelize';
import {enumStato} from '../src/entity/enum/enumStato';
import {enumPolicyTipo} from '../src/entity/enum/enumPolicyTipo';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('svt_plc_policy', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      cod: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      descrizione: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      tipo: {
        type: DataTypes.ENUM(...Object.values(enumPolicyTipo)),
        allowNull: false,
      },
      stato: {
        type: DataTypes.ENUM(...Object.values(enumStato)),
        allowNull: false,
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
    await queryInterface.dropTable('svt_plc_policy');
  },
};