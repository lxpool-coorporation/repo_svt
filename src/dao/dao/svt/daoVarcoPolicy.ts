import { ormPolicy } from '../../../models/svt/ormPolicy';
import { daoVarcoImplementation } from './daoVarco';
import { ePolicy } from '../../../entity/svt/ePolicy';
import { ormVarco } from '../../../models/svt/ormVarco';
import { ormVarcoPolicy } from '../../../models/svt/ormVarcoPolicy';

export class daoVarcoPolicyImplementation extends daoVarcoImplementation {
  // Metodo per ottenere i profili associati all'svt
  async getPolicies(idVarco: number): Promise<ePolicy[]> {
    const obj = await ormVarco.findByPk(idVarco);
    if (!obj) {
      throw new Error('Varco non trovato');
    } else {
      const objOrmVarcoPolicy = obj as ormVarcoPolicy;
      const objPolicies: ormPolicy[] = await objOrmVarcoPolicy.getPolicies(); // Metodo Sequelize

      return objPolicies.map((a) => {
        return new ePolicy(a.id, a.cod, a.descrizione, a.tipo, a.stato);
      });
    }
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoVarcoPolicy = new daoVarcoPolicyImplementation();
