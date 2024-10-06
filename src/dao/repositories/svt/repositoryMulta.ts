import { eMultaSpeedControl } from '../../../entity/svt/eMultaSpeedControl';
import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import {
  daoMultaSpeedControl,
  daoMultaSpeedControlImplementation,
} from '../../dao/svt/daoMultaSpeedControl';
import { Transaction } from 'sequelize';
import database from '../../../utils/database';
import { daoMulta, daoMultaImplementation } from '../../dao/svt/daoMulta';
import { eMulta } from '../../../entity/svt/eMulta';

const db = database.getInstance();

class repositoryMultaImplementation implements DaoInterfaceGeneric<eMulta> {
  private daoMulta: daoMultaImplementation;
  private daoMultaSpeedControl: daoMultaSpeedControlImplementation;

  constructor() {
    this.daoMulta = daoMulta;
    this.daoMultaSpeedControl = daoMultaSpeedControl;
  }
  get(id: number): Promise<eMulta | null> {
    return this.daoMulta.get(id);
  }
  getAll(options?: object): Promise<eMulta[]> {
    return this.daoMulta.getAll(options);
  }
  async save(t: eMulta): Promise<eMulta | null> {
    return daoMulta.save(t);
  }
  update(t: eMultaSpeedControl): Promise<void> {
    return this.daoMultaSpeedControl.update(t);
  }
  delete(t: eMultaSpeedControl): Promise<void> {
    return this.daoMultaSpeedControl.delete(t);
  }

  // Metodi MultaSpeedControl

  getMultaSpeedControl(id: number): Promise<eMultaSpeedControl | null> {
    return this.daoMultaSpeedControl.getWithMulta(id);
  }

  getAllMultaSpeedControl(options?: object): Promise<eMultaSpeedControl[]> {
    return this.daoMultaSpeedControl.getAllWithMulta(options);
  }

  async saveMultaSpeedControl(
    t: eMultaSpeedControl,
  ): Promise<eMultaSpeedControl | null> {
    const transaction: Transaction = await db.transaction();

    try {
      const options = { transaction };

      // Salva la multa base
      const multaBase = await daoMulta.save(t, options);
      if (!multaBase) {
        throw new Error('Failed to save base multa.');
      }

      // Salva la multa speed control
      const multaSpeedControl = await daoMultaSpeedControl.save(t, options);
      if (!multaSpeedControl) {
        throw new Error('Failed to save multa speed control.');
      }

      await transaction.commit();

      return new eMultaSpeedControl(
        multaBase.get_id(),
        multaBase.get_id_transito(),
        multaBase.get_id_policy(),
        multaBase.get_tipo_policy(),
        multaBase.get_id_automobilista(),
        multaBase.get_is_notturno(),
        multaBase.get_is_recidivo(),
        multaBase.get_path_bollettino(),
        multaBase.get_stato(),
        multaSpeedControl.get_speed(),
        multaSpeedControl.get_speed_real(),
        multaSpeedControl.get_speed_limit(),
        multaSpeedControl.get_speed_delta(),
      );
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateMultaSpeedControl(t: eMultaSpeedControl): Promise<void> {
    const transaction: Transaction = await db.transaction();

    try {
      const options = { transaction };

      // Aggiorna la multa base
      await daoMulta.update(t, options);

      // Aggiorna la multa speed control
      await daoMultaSpeedControl.update(t, options);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deleteMultaSpeedControl(t: eMultaSpeedControl): Promise<void> {
    const transaction: Transaction = await db.transaction();

    try {
      const options = { transaction };

      // Elimina la multa speed control
      await daoMultaSpeedControl.delete(t, options);

      // Elimina la multa base
      await daoMulta.delete(t, options);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const repositoryMulta = new repositoryMultaImplementation();
