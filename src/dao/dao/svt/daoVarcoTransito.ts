import { eTransito, eTransitoBuilder } from '../../../entity/svt/eTransito';
import { daoVarcoImplementation } from './daoVarco';

import dbOrm from '../../../models'; // Importa tutti i modelli e l'istanza Sequelize
import { ormTransito } from '../../..//models/svt/ormTransito';

export class daoVarcoTransitoImplementation extends daoVarcoImplementation {
  // Metodo per ottenere gli Transiti associati ad un Varco
  async getTransiti(idVarco: number): Promise<eTransito[]> {
    const obj = await dbOrm.ormVarco.findByPk(idVarco);
    if (!obj) {
      throw new Error('Varco non trovato');
    } else {
      const objTransiti: ormTransito[] =
        await dbOrm.objOrmVarcoTransito.getTransiti(); // Metodo Sequelize

      return objTransiti.map((a) => {
        return new eTransito(
          new eTransitoBuilder()
            .setId(a.id)
            .setDataTransito(a.data_transito)
            .setSpeed(a.speed)
            .setSpeedReal(a.speed_real)
            .setIdVarco(a.id_varco)
            .setMeteo(a.meteo)
            .setIdVeicolo(a.id_veicolo)
            .setpath_immagine(a.path_immagine)
            .setStato(a.stato),
        );
      });
    }
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoVarcoTransito = new daoVarcoTransitoImplementation();
