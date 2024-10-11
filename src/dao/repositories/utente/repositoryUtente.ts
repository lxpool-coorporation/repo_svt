import { daoUtente, daoUtenteImplementation } from '../../dao/utente/daoUtente';
import { eUtente } from '../../../entity/utente/eUtente';
import { Transaction } from 'sequelize';
import { eProfilo } from '../../../entity/utente/eProfilo';
import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import { ePermesso } from '../../../entity/utente/ePermesso';
import { eVeicolo } from '../../../entity/svt/eVeicolo';
import {
  daoProfilo,
  daoProfiloImplementation,
} from '../../../dao/dao/utente/daoProfilo';
import database from '../../../utils/database';
import { enumProfiloTipo } from '@/entity/enum/enumProfiloTipo';
import { repositoryProfilo } from './repositoryProfilo';

const db = database.getInstance();

class repositoryUtenteImplementation implements DaoInterfaceGeneric<eUtente> {
  private daoUtente: daoUtenteImplementation;
  private daoProfilo: daoProfiloImplementation;
  constructor() {
    this.daoUtente = daoUtente;
    this.daoProfilo = daoProfilo;
  }

  get(id: number): Promise<eUtente | null> {
    return this.daoUtente.get(id);
  }
  getByIdentificativo(cf: string): Promise<eUtente | null> {
    return this.daoUtente.getByIdentificativo(cf);
  }
  getAll(options?: object): Promise<eUtente[]> {
    return this.daoUtente.getAll(options);
  }
  save(
    t: eUtente,
    options?: { transaction?: Transaction },
  ): Promise<eUtente | null> {
    return this.daoUtente.save(t, options);
  }
  async saveUtenteProfili(t: eUtente, ps: eProfilo[]): Promise<eUtente | null> {
    let result: eUtente | null = null;

    const transaction: Transaction = await db.transaction();

    try {
      const options = { transaction };

      const utenteNew = await daoUtente.save(t, options);
      if (utenteNew) {
        const result_sub: Boolean = await daoUtente.saveUtentiProfili(
          utenteNew,
          ps,
          options,
        );
        if (result_sub) {
          await transaction.commit();
          result = utenteNew;
        }
      }
    } catch (err) {
      await transaction.rollback();
      throw new Error(`error: ${err}`);
    }

    return result;
  }
  async saveAssociazioneUtenteVeicoli(
    t: eUtente,
    ps: eVeicolo[],
  ): Promise<Boolean> {
    let result: Boolean = false;
    const transaction: Transaction = await db.transaction();

    try {
      const options = { transaction };

      const result_sub: Boolean = await daoUtente.saveUtentiVeicoli(
        t,
        ps,
        options,
      );
      if (result_sub) {
        await transaction.commit();
        result = true;
      }
    } catch (err) {
      await transaction.rollback();
      throw new Error(`error: ${err}`);
    }

    return result;
  }
  update(t: eUtente, options?: object): Promise<void> {
    return this.daoUtente.update(t, options);
  }
  delete(t: eUtente, options?: { transaction?: Transaction }): Promise<void> {
    return this.daoUtente.delete(t, options);
  }
  getProfili(idUtente: number): Promise<eProfilo[] | null> {
    return this.daoUtente.getProfiliByIdUtente(idUtente);
  }

  // getAllProfiliByEnum
  async getAllProfiliByEnum(
    enumProfilo: enumProfiloTipo,
  ): Promise<eProfilo[] | null> {
    const result = await repositoryProfilo.getAll({
      where: {
        enum_profilo: enumProfilo,
      },
    });
    return result;
  }

  getVeicoli(idUtente: number): Promise<eVeicolo[] | null> {
    return this.daoUtente.getVeicoliByIdUtente(idUtente);
  }
  async getPermessi(id: number): Promise<ePermesso[] | null> {
    const objProfili = await this.daoUtente.getProfiliByIdUtente(id);
    if (objProfili && objProfili.length > 0) {
      const objPermessi = await Promise.all(
        objProfili.map(async (profilo) => {
          return this.daoProfilo.getPermessiByProfilo(profilo.get_id());
        }),
      );
      // Appiattisce l'array, se `getPermessi` restituisce array di permessi per ogni profilo
      return objPermessi
        .flat()
        .filter((permesso): permesso is ePermesso => permesso !== null);
    }

    return null;
  }

  async deleteAssociazioneUtenteVeicolo(
    idUtente: number,
    idVeicolo: number,
  ): Promise<void> {
    await daoUtente.deleteAssociazioneUtenteVeicolo(idUtente, idVeicolo);
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const repositoryUtente = new repositoryUtenteImplementation();
