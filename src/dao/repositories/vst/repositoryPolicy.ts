import { ePolicySpeedControl } from '../../../entity/vst/ePolicySpeedControl';
import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import {
  daoPolicySpeedControl,
  daoPolicySpeedControlImplementation,
} from '../../dao/vst/daoPolicySpeedControl';
import { Transaction } from 'sequelize';
import database from '../../../utils/database';
import { daoPolicy, daoPolicyImplementation } from '../../dao/vst/daoPolicy';
import { ePolicy } from '../../../entity/vst/ePolicy';

const db = database.getInstance();

class repositoryPolicyImplementation implements DaoInterfaceGeneric<ePolicy> {
  private daoPolicy: daoPolicyImplementation;
  private daoPolicySpeedControl: daoPolicySpeedControlImplementation;

  constructor() {
    this.daoPolicy = daoPolicy;
    this.daoPolicySpeedControl = daoPolicySpeedControl;
  }
  get(id: number): Promise<ePolicy | null> {
    return this.daoPolicy.get(id);
  }
  getAll(options?: object): Promise<ePolicy[]> {
    return this.daoPolicy.getAll(options);
  }
  async save(t: ePolicy): Promise<ePolicy | null> {
    return daoPolicy.save(t);
  }
  update(t: ePolicySpeedControl): Promise<void> {
    return this.daoPolicySpeedControl.update(t);
  }
  delete(t: ePolicySpeedControl): Promise<void> {
    return this.daoPolicySpeedControl.delete(t);
  }

  // Metodi PolicySpeedControl

  getPolicySpeedControl(id: number): Promise<ePolicySpeedControl | null> {
    return this.daoPolicySpeedControl.getWithPolicy(id);
  }

  getAllPolicySpeedControl(options?: object): Promise<ePolicySpeedControl[]> {
    return this.daoPolicySpeedControl.getAllWithPolicy(options);
  }

  async savePolicySpeedControl(
    t: ePolicySpeedControl,
  ): Promise<ePolicySpeedControl | null> {
    const transaction: Transaction = await db.transaction();

    try {
      const options = { transaction };

      // Salva la policy base
      const policyBase = await daoPolicy.save(t, options);
      if (!policyBase) {
        throw new Error('Failed to save base policy.');
      }

      // Salva la policy speed control
      const policySpeedControl = await daoPolicySpeedControl.save(t, options);
      if (!policySpeedControl) {
        throw new Error('Failed to save policy speed control.');
      }

      await transaction.commit();

      return new ePolicySpeedControl(
        policyBase.get_id(),
        policyBase.get_cod(),
        policyBase.get_descrizione(),
        policyBase.get_tipo(),
        policyBase.get_stato(),
        policySpeedControl.get_meteo(),
        policySpeedControl.get_veicolo(),
        policySpeedControl.get_speed_limit(),
      );
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updatePolicySpeedControl(t: ePolicySpeedControl): Promise<void> {
    const transaction: Transaction = await db.transaction();

    try {
      const options = { transaction };

      // Aggiorna la policy base
      await daoPolicy.update(t, options);

      // Aggiorna la policy speed control
      await daoPolicySpeedControl.update(t, options);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deletePolicySpeedControl(t: ePolicySpeedControl): Promise<void> {
    const transaction: Transaction = await db.transaction();

    try {
      const options = { transaction };

      // Elimina la policy speed control
      await daoPolicySpeedControl.delete(t, options);

      // Elimina la policy base
      await daoPolicy.delete(t, options);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const repositoryPolicy = new repositoryPolicyImplementation();
