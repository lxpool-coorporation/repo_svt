import { ePolicySanctionSpeedControl } from '../../../entity/vst/ePolicySanctionSpeedControl';
import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import {
  daoPolicySanctionSpeedControl,
  daoPolicySanctionSpeedControlImplementation,
} from '../../dao/vst/daoPolicySanctionSpeedControl';
import { Transaction } from 'sequelize';
import database from '../../../utils/database';
import {
  daoPolicySanction,
  daoPolicySanctionImplementation,
} from '../../dao/vst/daoPolicySanction';
import { ePolicySanction } from '../../../entity/vst/ePolicySanction';

const db = database.getInstance();

class repositoryPolicySanctionImplementation
  implements DaoInterfaceGeneric<ePolicySanction>
{
  private daoPolicySanction: daoPolicySanctionImplementation;
  private daoPolicySanctionSpeedControl: daoPolicySanctionSpeedControlImplementation;

  constructor() {
    this.daoPolicySanction = daoPolicySanction;
    this.daoPolicySanctionSpeedControl = daoPolicySanctionSpeedControl;
  }
  get(id: number): Promise<ePolicySanction | null> {
    return this.daoPolicySanction.get(id);
  }
  getAll(options?: object): Promise<ePolicySanction[]> {
    return this.daoPolicySanction.getAll(options);
  }
  async save(t: ePolicySanction): Promise<ePolicySanction | null> {
    return daoPolicySanction.save(t);
  }
  update(t: ePolicySanctionSpeedControl): Promise<void> {
    return this.daoPolicySanctionSpeedControl.update(t);
  }
  delete(t: ePolicySanctionSpeedControl): Promise<void> {
    return this.daoPolicySanctionSpeedControl.delete(t);
  }

  // Metodi PolicySanctionSpeedControl

  getPolicySanctionSpeedControl(
    id: number,
  ): Promise<ePolicySanctionSpeedControl | null> {
    return this.daoPolicySanctionSpeedControl.getWithPolicySanction(id);
  }

  getAllPolicySanctionSpeedControl(
    options?: object,
  ): Promise<ePolicySanctionSpeedControl[]> {
    return this.daoPolicySanctionSpeedControl.getAllWithPolicySanction(options);
  }

  async savePolicySanctionSpeedControl(
    t: ePolicySanctionSpeedControl,
  ): Promise<ePolicySanctionSpeedControl | null> {
    const transaction: Transaction = await db.transaction();

    try {
      const options = { transaction };

      // Salva la policy base
      const policyBase = await daoPolicySanction.save(t, options);
      if (!policyBase) {
        throw new Error('Failed to save base policy.');
      }

      // Salva la policy speed control
      const policySanctionSpeedControl =
        await daoPolicySanctionSpeedControl.save(t, options);
      if (!policySanctionSpeedControl) {
        throw new Error('Failed to save policy speed control.');
      }

      await transaction.commit();

      return new ePolicySanctionSpeedControl(
        policyBase.get_id(),
        policyBase.get_tipo_policy(),
        policyBase.get_cod(),
        policyBase.get_descrizione(),
        policyBase.get_costo_min(),
        policyBase.get_costo_max(),
        policyBase.get_costo_punti_patente(),
        policyBase.get_stato(),
        policySanctionSpeedControl.get_speed_min(),
        policySanctionSpeedControl.get_speed_max(),
      );
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updatePolicySanctionSpeedControl(
    t: ePolicySanctionSpeedControl,
  ): Promise<void> {
    const transaction: Transaction = await db.transaction();

    try {
      const options = { transaction };

      // Aggiorna la policy base
      await daoPolicySanction.update(t, options);

      // Aggiorna la policy speed control
      await daoPolicySanctionSpeedControl.update(t, options);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deletePolicySanctionSpeedControl(
    t: ePolicySanctionSpeedControl,
  ): Promise<void> {
    const transaction: Transaction = await db.transaction();

    try {
      const options = { transaction };

      // Elimina la policy speed control
      await daoPolicySanctionSpeedControl.delete(t, options);

      // Elimina la policy base
      await daoPolicySanction.delete(t, options);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const repositoryPolicySanction =
  new repositoryPolicySanctionImplementation();
