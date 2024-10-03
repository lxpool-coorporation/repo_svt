import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('utn_utente_profilo', {
      id_utente: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'utn_utente', 
          key: 'id',           
        },
      },
      id_profilo: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'utn_prf_profilo', 
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
    await queryInterface.dropTable('utn_utente_profilo');
  },
};