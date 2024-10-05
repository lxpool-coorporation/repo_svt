import { ormVarco } from '../../../models/svt/ormVarco';
import { eTransito, eTransitoBuilder } from '../../../entity/svt/eTransito';
import { ormTransito } from '../../../models/svt/ormTransito';
import { ormVarcoTransito } from '../../../models/svt/ormVarcoTransito';
import { daoVarcoImplementation } from './daoVarco';

export class daoVarcoTransitoImplementation extends daoVarcoImplementation {
  // Metodo per ottenere gli Transiti associati ad un Varco
  async getTransiti(idVarco: number): Promise<eTransito[]> {
    const obj = await ormVarco.findByPk(idVarco);
    if (!obj) {
      throw new Error('Varco non trovato');
    } else {
      const objOrmVarcoTransito = obj as ormVarcoTransito;
      const objTransiti: ormTransito[] =
        await objOrmVarcoTransito.getTransiti(); // Metodo Sequelize

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
