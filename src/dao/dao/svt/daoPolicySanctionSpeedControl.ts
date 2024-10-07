// daoPolicySanctionSpeedControl.ts
import { ePolicySanctionSpeedControl } from '../../../entity/svt/ePolicySanctionSpeedControl';
import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import { Transaction } from 'sequelize';

import dbOrm from '../../../models'; // Importa tutti i modelli e l'istanza Sequelize
import { ormPolicySanction } from '../../../models/svt/ormPolicySanction';
import { ormPolicySanctionSpeedControl } from '../../../models/svt/ormPolicySanctionSpeedControl';

export class daoPolicySanctionSpeedControlImplementation
  implements DaoInterfaceGeneric<ePolicySanctionSpeedControl>
{
  async get(id: number): Promise<ePolicySanctionSpeedControl | null> {
    const ormObj = await dbOrm.ormPolicySanctionSpeedControl.findByPk(id);
    if (!ormObj) {
      throw new Error(`PolicySanction non trovato per l'id ${id}`);
    }
    return new ePolicySanctionSpeedControl(
      ormObj.id_policy_sanction,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      ormObj.speed_min,
      ormObj.speed_max,
    );
  }

  async getWithPolicySanction(
    id_policy_sanction: number,
    options?: { transaction?: Transaction },
  ): Promise<ePolicySanctionSpeedControl | null> {
    const ormObj = await dbOrm.ormPolicySanctionSpeedControl.findOne({
      where: { id_policy_sanction },
      include: [
        {
          model: ormPolicySanction,
          as: 'policySanction',
        },
      ],
      transaction: options?.transaction,
    });

    if (!ormObj || !ormObj.policySanction) {
      return null;
    }

    const policyBase = ormObj.policySanction;
    return new ePolicySanctionSpeedControl(
      policyBase.id,
      policyBase.tipo_policy,
      policyBase.cod,
      policyBase.descrizione,
      policyBase.costo_min,
      policyBase.costo_max,
      policyBase.costo_punti_patente,
      policyBase.stato,
      ormObj.speed_min,
      ormObj.speed_max,
    );
  }

  async getAllWithPolicySanction(options?: {
    transaction?: Transaction;
  }): Promise<ePolicySanctionSpeedControl[]> {
    const ormObjs: ormPolicySanctionSpeedControl[] =
      await dbOrm.ormPolicySanctionSpeedControl.findAll({
        include: [
          {
            model: ormPolicySanction,
            as: 'policy',
          },
        ],
        transaction: options?.transaction,
      });

    return ormObjs.map((ormObj) => {
      const policyBase = ormObj.policySanction!;
      return new ePolicySanctionSpeedControl(
        policyBase.id,
        policyBase.tipo_policy,
        policyBase.cod,
        policyBase.descrizione,
        policyBase.costo_min,
        policyBase.costo_max,
        policyBase.costo_punti_patente,
        policyBase.stato,
        ormObj.speed_min,
        ormObj.speed_max,
      );
    });
  }

  // Trova tutti gli utenti usando Sequelize
  async getAll(options?: object): Promise<ePolicySanctionSpeedControl[]> {
    const objs: ormPolicySanctionSpeedControl[] =
      await dbOrm.ormPolicySanctionSpeedControl.findAll(options);
    return objs.map((item) => {
      return new ePolicySanctionSpeedControl(
        item.id_policy_sanction,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        item.speed_min,
        item.speed_max,
      );
    });
  }

  // Salva un nuovo PolicySanctionSpeedControl nel database usando Sequelize
  async save(
    t: ePolicySanctionSpeedControl,
    options?: { transaction?: Transaction },
  ): Promise<ePolicySanctionSpeedControl | null> {
    try {
      // Crea la policy speed control
      await dbOrm.ormPolicySanctionSpeedControl.create(
        {
          id: t.get_id(),
          tipo: t.get_tipo_policy(),
          cod: t.get_cod(),
          descrizione: t.get_descrizione(),
          costo_min: t.get_costo_min(),
          costo_max: t.get_costo_max(),
          costo_punti_patente: t.get_costo_punti_patente(),
          stato: t.get_stato(),
          speed_min: t.get_speed_min(),
          speed_max: t.get_speed_max(),
        },
        options,
      );

      return t;
    } catch (error) {
      throw error;
    }
  }

  // Aggiorna una policy esistente nel database
  async update(
    t: ePolicySanctionSpeedControl,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    try {
      // Aggiorna la policy speed control
      const [speedControlUpdatedRows] =
        await dbOrm.ormPolicySanctionSpeedControl.update(
          {
            speed_min: t.get_speed_min(),
            speed_max: t.get_speed_max(),
          },
          {
            where: { id_policy_sanction: t.get_id() },
            transaction: options?.transaction,
          },
        );

      if (speedControlUpdatedRows === 0) {
        throw new Error(
          `PolicySanctionSpeedControl con ID ${t.get_id()} non trovata.`,
        );
      }
    } catch (error) {
      throw error;
    }
  }

  // Elimina un PolicySanctionSpeedControl dal database usando Sequelize
  async delete(
    t: ePolicySanctionSpeedControl,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    try {
      // Elimina la policy speed control
      const deletedSpeedControlRows =
        await dbOrm.ormPolicySanctionSpeedControl.destroy({
          where: { id_policy_sanction: t.get_id() },
          transaction: options?.transaction,
        });

      if (deletedSpeedControlRows === 0) {
        throw new Error(
          `PolicySanctionSpeedControl con ID ${t.get_id()} non trovata.`,
        );
      }
    } catch (error) {
      throw error;
    }
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoPolicySanctionSpeedControl =
  new daoPolicySanctionSpeedControlImplementation();
