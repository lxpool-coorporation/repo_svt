import { ormPolicy } from '../../../models/svt/ormPolicy';
import { daoVarcoImplementation } from './daoVarco';
import { ePolicy } from '../../../entity/svt/ePolicy';

import dbOrm from '../../../models'; // Importa tutti i modelli e l'istanza Sequelize

export class daoVarcoPolicyImplementation extends daoVarcoImplementation {
  // Metodo per ottenere i profili associati all'svt
  async getPolicies(idVarco: number): Promise<ePolicy[]> {
    const obj = await dbOrm.ormVarco.findByPk(idVarco);
    if (!obj) {
      throw new Error('Varco non trovato');
    } else {
      const objPolicies: ormPolicy[] =
        await dbOrm.objOrmVarcoPolicy.getPolicies(); // Metodo Sequelize

      return objPolicies.map((a) => {
        return new ePolicy(a.id, a.cod, a.descrizione, a.tipo, a.stato);
      });
    }
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoVarcoPolicy = new daoVarcoPolicyImplementation();
