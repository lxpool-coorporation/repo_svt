import { QueryInterface, DataTypes } from 'sequelize';
import {enumStato} from '../src/entity/enum/enumStato';
import {enumPolicyTipo} from '../src/entity/enum/enumPolicyTipo';
import { enumVeicoloTipo } from '../src/entity/enum/enumVeicoloTipo';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('vst_plc_sanction', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      tipo_policy: {
        type: DataTypes.ENUM(...Object.values(enumPolicyTipo)),
        allowNull: false,
      },
      cod: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descrizione: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      costo_min: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      costo_max: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      costo_punti_patente: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      stato: {
        type: DataTypes.ENUM(...Object.values(enumStato)),
        allowNull: false,
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('vst_plc_sanction');
  },
};