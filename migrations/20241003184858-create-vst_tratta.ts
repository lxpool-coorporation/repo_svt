import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('vst_tratta', {
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
      id_varco_ingresso: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'vst_varco', // Nome della tabella a cui si riferisce
          key: 'id',
        },
      },
      id_varco_uscita: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'vst_varco', // Nome della tabella a cui si riferisce
          key: 'id',
        },
      },
      distanza: {
        type: DataTypes.INTEGER,
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
    await queryInterface.dropTable('vst_tratta');
  },
};