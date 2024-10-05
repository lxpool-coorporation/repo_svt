// daoPolicySpeedControl.ts
import { ormPolicySpeedControl } from '../../../models/svt/ormPolicySpeedControl';
import { ePolicySpeedControl } from '../../../entity/svt/ePolicySpeedControl';
import { ormPolicy } from '../../../models/svt/ormPolicy';
import { DaoInterfaceGeneric } from '../../../dao/interfaces/generic/daoInterfaceGeneric';
import { Transaction } from 'sequelize';
import database from '../../../utils/database';

const db = database.getInstance();

export class daoPolicySpeedControlImplementation
  implements DaoInterfaceGeneric<ePolicySpeedControl>
{
  async get(id_policy: number): Promise<ePolicySpeedControl | null> {
    const ormObj = await ormPolicySpeedControl.findOne({
      where: { id_policy },
      include: [{ model: ormPolicy, as: 'policy' }],
    });
    if (!ormObj) return null;

    const policyBase = ormObj.policy!;
    return new ePolicySpeedControl(
      policyBase.id,
      policyBase.cod,
      policyBase.descrizione,
      policyBase.tipo,
      policyBase.stato,
      ormObj.meteo,
      ormObj.veicolo,
      ormObj.speed_limit,
    );
  }

  // Trova tutti gli utenti usando Sequelize
  async getAll(options?: object): Promise<ePolicySpeedControl[]> {
    const objs = await ormPolicySpeedControl.findAll(options);
    return objs.map((item) => {
      const policyBase = item.policy!;
      return new ePolicySpeedControl(
        policyBase.id,
        policyBase.cod,
        policyBase.descrizione,
        policyBase.tipo,
        policyBase.stato,
        item.meteo,
        item.veicolo,
        item.speed_limit,
      );
    });
  }

  // Salva un nuovo PolicySpeedControl nel database usando Sequelize
  async save(t: ePolicySpeedControl): Promise<ePolicySpeedControl | null> {
    const existingPolicySpeedControl = await ormPolicySpeedControl.findByPk(
      t.get_id(),
    );
    if (existingPolicySpeedControl) {
      throw new Error('A User with the specified id already exists');
    }

    const transaction: Transaction = await db.transaction();

    try {
      // Crea la policy base
      const policyBase = await ormPolicy.create(
        {
          cod: t.get_cod(),
          descrizione: t.get_descrizione(),
          tipo: t.get_tipo(),
          stato: t.get_stato(),
        },
        { transaction },
      );

      // Crea la policy speed control
      const policySpeedControl = await ormPolicySpeedControl.create(
        {
          id_policy: policyBase.id,
          meteo: t.get_meteo(),
          veicolo: t.get_veicolo(),
          speed_limit: t.get_speed_limit(),
        },
        { transaction },
      );

      await transaction.commit();

      return new ePolicySpeedControl(
        policyBase.id,
        policyBase.cod,
        policyBase.descrizione,
        policyBase.tipo,
        policyBase.stato,
        policySpeedControl.meteo,
        policySpeedControl.veicolo,
        policySpeedControl.speed_limit,
      );
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Aggiorna una policy esistente nel database
  async update(t: ePolicySpeedControl): Promise<void> {
    const transaction: Transaction = await db.transaction();

    try {
      // Aggiorna la policy base
      const [policyUpdatedRows] = await ormPolicy.update(
        {
          cod: t.get_cod(),
          descrizione: t.get_descrizione(),
          tipo: t.get_tipo(),
          stato: t.get_stato(),
        },
        {
          where: { id_policy: t.get_id() },
          transaction,
        },
      );

      if (policyUpdatedRows === 0) {
        throw new Error(`Policy con ID ${t.get_id()} non trovata.`);
      }

      // Aggiorna la policy speed control
      const [speedControlUpdatedRows] = await ormPolicySpeedControl.update(
        {
          meteo: t.get_meteo(),
          veicolo: t.get_veicolo(),
          speed_limit: t.get_speed_limit(),
        },
        {
          where: { id_policy: t.get_descrizione() },
          transaction,
        },
      );

      if (speedControlUpdatedRows === 0) {
        throw new Error(`PolicySpeedControl con ID ${t.get_id()} non trovata.`);
      }

      await transaction.commit();

      // Recupera la policy aggiornata per restituirla
      const updatedPolicySpeedControl = await ormPolicySpeedControl.findOne({
        where: { id: t.get_id() },
        include: [{ model: ormPolicy, as: 'policy' }],
      });

      if (!updatedPolicySpeedControl || !updatedPolicySpeedControl.policy) {
        throw new Error(
          `PolicySpeedControl con ID ${t.get_id()} non trovata dopo l'aggiornamento.`,
        );
      }
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Elimina un PolicySpeedControl dal database usando Sequelize
  async delete(t: ePolicySpeedControl): Promise<void> {
    const transaction: Transaction = await db.transaction();

    try {
      // Elimina la policy speed control
      const deletedSpeedControlRows = await ormPolicySpeedControl.destroy({
        where: { id_policy: t.get_id() },
        transaction,
      });

      if (deletedSpeedControlRows === 0) {
        throw new Error(`PolicySpeedControl con ID ${t.get_id()} non trovata.`);
      }

      // Elimina la policy base
      const deletedPolicyRows = await ormPolicy.destroy({
        where: { id: t.get_id() },
        transaction,
      });

      if (deletedPolicyRows === 0) {
        throw new Error(`Policy con ID ${t.get_id()} non trovata.`);
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoPolicySpeedControl = new daoPolicySpeedControlImplementation();
