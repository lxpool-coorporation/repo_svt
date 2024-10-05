import { ormPolicy } from '../../../models/svt/ormPolicy';
import { daoTrattaImplementation } from './daoTratta';
import { ePolicy } from '../../../entity/svt/ePolicy';
import { ormTratta } from '../../../models/svt/ormTratta';
import { ormTrattaPolicy } from '../../../models/svt/ormTrattaPolicy';

export class daoTrattaPolicyImplementation extends daoTrattaImplementation {
  // Metodo per ottenere i profili associati all'svt
  async getPolicies(idTratta: number): Promise<ePolicy[]> {
    const obj = await ormTratta.findByPk(idTratta);
    if (!obj) {
      throw new Error('Tratta non trovato');
    } else {
      const objOrmTrattaPolicy = obj as ormTrattaPolicy;
      const objPolicies: ormPolicy[] = await objOrmTrattaPolicy.getPolicies(); // Metodo Sequelize

      return objPolicies.map((a) => {
        return new ePolicy(a.id, a.cod, a.descrizione, a.tipo, a.stato);
      });
    }
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoTrattaPolicy = new daoTrattaPolicyImplementation();
