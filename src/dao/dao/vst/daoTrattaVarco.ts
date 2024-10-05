import { ormTratta } from '../../../models/vst/ormTratta';
import { ormVarco } from '../../../models/vst/ormVarco';
import { daoTrattaImplementation } from './daoTratta';
import { ormTrattaVarco } from '../../../models/vst/ormTrattaVarco';
import { eVarco } from '../../../entity/vst/eVarco';

export class daoTrattaVarcoImplementation extends daoTrattaImplementation {
  // Metodo per ottenere gli Varchii associati ad un Tratta
  async getVarchi(idTratta: number): Promise<eVarco[]> {
    const obj = await ormTratta.findByPk(idTratta);
    if (!obj) {
      throw new Error('Tratta non trovato');
    } else {
      const objOrmTrattaVarco = obj as ormTrattaVarco;
      const objVarchi: ormVarco[] = await objOrmTrattaVarco.getVarchi(); // Metodo Sequelize

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
