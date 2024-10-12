import { Transaction } from 'sequelize';
import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import { eTransito } from '../../../entity/svt/eTransito';
import {
  daoTransito,
  daoTransitoImplementation,
} from '../../dao/svt/daoTransito';
import sequelize, { Op, col, where } from 'sequelize';

class repositoryTransitoImplementation
  implements DaoInterfaceGeneric<eTransito>
{
  private daoTransito: daoTransitoImplementation;

  constructor() {
    this.daoTransito = daoTransito;
  }
  get(id: number): Promise<eTransito | null> {
    return this.daoTransito.get(id);
  }
  getAll(options?: object): Promise<eTransito[]> {
    return this.daoTransito.getAll(options);
  }
  getFromQuery(options?: any): Promise<eTransito[]> {
    let ricerca: sequelize.Utils.Where[] = [];
    if (options?.arrayVarchi && options?.arrayVarchi?.length > 0) {
      ricerca.push(
        where(
          col('id_varco'), // Funzione LOWER su identificativo
          { [Op.in]: options?.arrayVarchi }, // Usare Op.in con valori in lowercase
        ),
      );
    }
    if (options?.arrayStatoTransiti && options?.arrayStatoTransiti.length > 0) {
      ricerca.push(
        where(
          col('stato'), // Funzione LOWER su identificativo
          { [Op.in]: options?.arrayStatoTransiti }, // Usare Op.in con valori in lowercase
        ),
      );
    }
    return this.daoTransito.getAll({
      where: {
        [Op.and]: ricerca,
      },
    });
  }
  save(
    t: eTransito,
    options?: { transaction?: Transaction },
  ): Promise<eTransito | null> {
    return this.daoTransito.save(t, options);
  }
  update(t: eTransito, options?: object): Promise<void> {
    return this.daoTransito.update(t, options);
  }
  updateFields(
    t: eTransito,
    fieldsToUpdate: Partial<{
      data_transito: Date;
      speed: number;
      speed_real: number;
      id_varco: number;
      meteo: string;
      id_veicolo: number;
      path_immagine: string;
      stato: string;
    }>,
    options?: object,
  ): Promise<void> {
    return this.daoTransito.updateFields(t, fieldsToUpdate, options);
  }
  delete(t: eTransito, options?: { transaction?: Transaction }): Promise<void> {
    return this.daoTransito.delete(t, options);
  }
  getTransitoIngressoByTransitoUscita(
    idTransitoUscita: number,
  ): Promise<eTransito | null> {
    return daoTransito.getTransitoIngressoByTransitoUscita(idTransitoUscita);
  }

  getAllTransitiByTarga(targa: string): Promise<eTransito[] | null> {
    return daoTransito.getAllTransitiByTarga(targa);
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const repositoryTransito = new repositoryTransitoImplementation();
