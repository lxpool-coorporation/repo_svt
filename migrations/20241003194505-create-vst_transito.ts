import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('vst_transito', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      data_transito: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      speed: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      speed_real: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      id_varco: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'vst_varco', // Nome della tabella a cui si riferisce
          key: 'id',
        },
      },
      meteo: {
        type: DataTypes.ENUM('sereno', 'pioggia'), // Definizione dell'ENUM nel database
        allowNull: false,
        defaultValue: 'sereno',
      },
      id_veicolo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'vst_veicolo', // Nome della tabella a cui si riferisce
          key: 'id',
        },
      },
      immagine: {
        allowNull: true,
        type: DataTypes.STRING,
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
    await queryInterface.dropTable('vst_transito');
  },
};