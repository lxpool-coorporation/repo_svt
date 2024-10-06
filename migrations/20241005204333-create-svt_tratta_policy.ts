import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('svt_tratta_policy', {
      id_tratta: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'svt_tratta', 
          key: 'id',           
        },
      },
      id_policy: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'svt_plc_policy', 
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
    await queryInterface.dropTable('svt_tratta_policy');
  },
};