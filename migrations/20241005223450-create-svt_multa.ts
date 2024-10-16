import { QueryInterface, DataTypes } from 'sequelize';
import {enumMultaStato} from '../src/entity/enum/enumMultaStato';
import { enumPolicyTipo } from '../src/entity/enum/enumPolicyTipo';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('svt_multa', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_transito: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'svt_transito',
          key: 'id',
        },
      },
      id_policy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'svt_plc_policy',
          key: 'id',
        },
      },
      tipo_policy: {
        type: DataTypes.ENUM(...Object.values(enumPolicyTipo)),
        allowNull: false,
      },
      id_veicolo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'svt_veicolo',
          key: 'id',
        },
      },
      id_automobilista: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'utn_utente',
          key: 'id',
        },
      },
      is_notturno: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      is_recidivo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      stato: {
        type: DataTypes.ENUM(...Object.values(enumMultaStato)),
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
    await queryInterface.dropTable('svt_multa');
  },
};