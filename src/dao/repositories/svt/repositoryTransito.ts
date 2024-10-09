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
  delete(t: eTransito, options?: { transaction?: Transaction }): Promise<void> {
    return this.daoTransito.delete(t, options);
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const repositoryTransito = new repositoryTransitoImplementation();
