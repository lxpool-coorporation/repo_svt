import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('utn_utente_veicolo', {
      id_utente: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'utn_utente', 
          key: 'id',           
        },
      },
      id_veicolo: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'vst_veicolo', 
          key: 'id',            
        },
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
    await queryInterface.dropTable('utn_utente_veicolo');
  },
};