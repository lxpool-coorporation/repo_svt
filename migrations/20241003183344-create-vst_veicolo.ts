import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('vst_veicolo', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      tipo: {
        type: DataTypes.ENUM('automobile', 'motoveicoli', 'rimorchi', 'autobus', 'camion',), // Definizione dell'ENUM nel database
        allowNull: false,
        defaultValue: 'automobile',
      },
      targa: {
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
    await queryInterface.dropTable('vst_veicolo');
  },
};