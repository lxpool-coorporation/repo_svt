import { QueryInterface, DataTypes } from 'sequelize';
import {enumStato} from '../../entity/enum/enumStato';
import {enumPolicyTipo} from '../../entity/enum/enumPolicyTipo';
import { enumVeicoloTipo } from '../../entity/enum/enumVeicoloTipo';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('svt_plc_sanction', {
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
    await queryInterface.dropTable('svt_plc_sanction');
  },
};