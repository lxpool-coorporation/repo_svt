import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('svt_varco_policy', {
      id_varco: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'svt_varco', 
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
    await queryInterface.dropTable('svt_varco_policy');
  },
};