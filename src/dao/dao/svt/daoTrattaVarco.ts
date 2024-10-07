import { daoTrattaImplementation } from './daoTratta';
import { eVarco } from '../../../entity/svt/eVarco';

import dbOrm from '../../../models'; // Importa tutti i modelli e l'istanza Sequelize
import { ormVarco } from '../../../models/svt/ormVarco';

export class daoTrattaVarcoImplementation extends daoTrattaImplementation {
  // Metodo per ottenere gli Varchii associati ad un Tratta
  async getVarchi(idTratta: number): Promise<eVarco[]> {
    const obj = await dbOrm.ormTratta.findByPk(idTratta);
    if (!obj) {
      throw new Error('Tratta non trovato');
    } else {
      const objVarchi: ormVarco[] = await dbOrm.objOrmTrattaVarco.getVarchi(); // Metodo Sequelize

      return objVarchi.map((a) => {
        return new eVarco(
          a.id,
          a.cod,
          a.descrizione,
          a.latitudine,
          a.longitudine,
          a.stato,
        );
      });
    }
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoTrattaVarco = new daoTrattaVarcoImplementation();
