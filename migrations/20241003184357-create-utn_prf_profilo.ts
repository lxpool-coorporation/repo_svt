
import { QueryInterface, DataTypes } from 'sequelize';

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
      stato: {
        type: DataTypes.ENUM('attivo', 'disattivo'), // Definizione dell'ENUM nel database
        allowNull: false,
        defaultValue: 'attivo',
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
