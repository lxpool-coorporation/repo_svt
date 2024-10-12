import { QueryInterface, DataTypes } from 'sequelize';
import {enumVeicoloStato} from '../../entity/enum/enumVeicoloStato';
import {enumVeicoloTipo} from '../../entity/enum/enumVeicoloTipo';



export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('svt_veicolo', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      tipo: {
        type: DataTypes.ENUM(...Object.values(enumVeicoloTipo )), // Definizione dell'ENUM nel database
        allowNull: false,
        defaultValue: enumVeicoloTipo.autoveicoli,
      },
      targa: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      stato: {
        type: DataTypes.ENUM(...Object.values(enumVeicoloStato)), // Definizione dell'ENUM nel database
        allowNull: false,
        defaultValue: enumVeicoloStato.in_attesa  ,
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
    await queryInterface.dropTable('svt_veicolo');
  },
};