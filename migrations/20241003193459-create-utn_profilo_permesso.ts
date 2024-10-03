import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('utn_profilo_permesso', {
      id_profilo: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'utn_prf_profilo', 
          key: 'id',           
        },
      },
      id_permesso: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'utn_prf_permesso', 
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
    await queryInterface.dropTable('utn_profilo_permesso');
  },
};