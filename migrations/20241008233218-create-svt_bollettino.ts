import { QueryInterface, DataTypes } from 'sequelize';
import {enumBollettinoStato} from '../../entity/enum/enumBollettinoStato';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('svt_bollettino', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    id_multa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'svt_multa',
        key: 'id',
      },
    },
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    importo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    path_bollettino: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stato: {
        type: DataTypes.ENUM(...Object.values(enumBollettinoStato)),
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
    await queryInterface.dropTable('svt_bollettino');
  },
};