import { QueryInterface, DataTypes } from 'sequelize';
import {enumMeteoTipo} from '../src/entity/enum/enumMeteoTipo';
import {enumVeicoloTipo} from '../src/entity/enum/enumVeicoloTipo';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('svt_plc_speed_control', {
      id_policy: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'svt_plc_policy',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      meteo: {
        type: DataTypes.ENUM(...Object.values(enumMeteoTipo)),
        allowNull: false,
      },
      veicolo: {
        type: DataTypes.ENUM(...Object.values(enumVeicoloTipo)),
        allowNull: false,
      },
      speed_limit: {
        type: DataTypes.INTEGER,
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
    await queryInterface.dropTable('svt_plc_speed_control');
  },
};