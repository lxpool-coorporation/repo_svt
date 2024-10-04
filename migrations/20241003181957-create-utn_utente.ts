import { QueryInterface, DataTypes } from 'sequelize';
import {enumStato} from '../src/entity/enum/enumStato';


export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('utn_utente', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      identificativo: {
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
    await queryInterface.dropTable('utn_utente');
  },
};