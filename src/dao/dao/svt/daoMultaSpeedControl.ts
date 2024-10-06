// daoMultaSpeedControl.ts
import { ormMultaSpeedControl } from '../../../models/svt/ormMultaSpeedControl';
import { eMultaSpeedControl } from '../../../entity/svt/eMultaSpeedControl';
import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import { Transaction } from 'sequelize';
import { ormMulta } from '../../../models/svt/ormMulta';

export class daoMultaSpeedControlImplementation
  implements DaoInterfaceGeneric<eMultaSpeedControl>
{
  async get(id: number): Promise<eMultaSpeedControl | null> {
    const ormObj = await ormMultaSpeedControl.findByPk(id);
    if (!ormObj) {
      throw new Error(`Multa non trovato per l'id ${id}`);
    }
    return new eMultaSpeedControl(
      ormObj.id_multa,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      ormObj.speed,
      ormObj.speed_real,
      ormObj.speed_limit,
      ormObj.speed_delta,
    );
  }

  async getWithMulta(
    id_multa: number,
    options?: { transaction?: Transaction },
  ): Promise<eMultaSpeedControl | null> {
    const ormObj = await ormMultaSpeedControl.findOne({
      where: { id_multa },
      include: [
        {
          model: ormMulta,
          as: 'multa',
        },
      ],
      transaction: options?.transaction,
    });

    if (!ormObj || !ormObj.multa) {
      return null;
    }

    const multaBase = ormObj.multa;
    return new eMultaSpeedControl(
      multaBase.id,
      multaBase.id_transito,
      multaBase.id_policy,
      multaBase.tipo_policy,
      multaBase.id_automobilista,
      multaBase.is_notturno,
      multaBase.is_recidivo,
      multaBase.path_bollettino,
      multaBase.stato,
      ormObj.speed,
      ormObj.speed_real,
      ormObj.speed_limit,
      ormObj.speed_delta,
    );
  }

  async getAllWithMulta(options?: {
    transaction?: Transaction;
  }): Promise<eMultaSpeedControl[]> {
    const ormObjs = await ormMultaSpeedControl.findAll({
      include: [
        {
          model: ormMulta,
          as: 'multa',
        },
      ],
      transaction: options?.transaction,
    });

    return ormObjs.map((ormObj) => {
      const multaBase = ormObj.multa!;
      return new eMultaSpeedControl(
        multaBase.id,
        multaBase.id_transito,
        multaBase.id_policy,
        multaBase.tipo_policy,
        multaBase.id_automobilista,
        multaBase.is_notturno,
        multaBase.is_recidivo,
        multaBase.path_bollettino,
        multaBase.stato,
        ormObj.speed,
        ormObj.speed_real,
        ormObj.speed_limit,
        ormObj.speed_delta,
      );
    });
  }

  // Trova tutti gli utenti usando Sequelize
  async getAll(options?: object): Promise<eMultaSpeedControl[]> {
    const objs = await ormMultaSpeedControl.findAll(options);
    return objs.map((item) => {
      return new eMultaSpeedControl(
        item.id_multa,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        item.speed,
        item.speed_real,
        item.speed_limit,
        item.speed_delta,
      );
    });
  }

  // Salva un nuovo MultaSpeedControl nel database usando Sequelize
  async save(
    t: eMultaSpeedControl,
    options?: { transaction?: Transaction },
  ): Promise<eMultaSpeedControl | null> {
    try {
      // Crea la multa speed control
      await ormMultaSpeedControl.create(
        {
          id_multa: t.get_id(),
          speed: t.get_speed(),
          speed_real: t.get_speed_real(),
          speed_delta: t.get_speed_delta(),
          speed_limit: t.get_speed_limit(),
        },
        options,
      );

      return t;
    } catch (error) {
      throw error;
    }
  }

  // Aggiorna una multa esistente nel database
  async update(
    t: eMultaSpeedControl,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    try {
      // Aggiorna la multa speed control
      const [speedControlUpdatedRows] = await ormMultaSpeedControl.update(
        {
          speed: t.get_speed(),
          speed_real: t.get_speed_real(),
          speed_delta: t.get_speed_delta(),
          speed_limit: t.get_speed_limit(),
        },
        {
          where: { id_multa: t.get_id() },
          transaction: options?.transaction,
        },
      );

      if (speedControlUpdatedRows === 0) {
        throw new Error(`MultaSpeedControl con ID ${t.get_id()} non trovata.`);
      }
    } catch (error) {
      throw error;
    }
  }

  // Elimina un MultaSpeedControl dal database usando Sequelize
  async delete(
    t: eMultaSpeedControl,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    try {
      // Elimina la multa speed control
      const deletedSpeedControlRows = await ormMultaSpeedControl.destroy({
        where: { id_multa: t.get_id() },
        transaction: options?.transaction,
      });

      if (deletedSpeedControlRows === 0) {
        throw new Error(`MultaSpeedControl con ID ${t.get_id()} non trovata.`);
      }
    } catch (error) {
      throw error;
    }
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoMultaSpeedControl = new daoMultaSpeedControlImplementation();
