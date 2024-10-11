// daoMultaSpeedControl.ts
import { eMultaSpeedControl } from '../../../entity/svt/eMultaSpeedControl';
import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import { QueryTypes, Transaction } from 'sequelize';

import dbOrm from '../../../models'; // Importa tutti i modelli e l'istanza Sequelize
import { ormMultaSpeedControl } from '../../../models/svt/ormMultaSpeedControl';
import { ormMulta } from '../../../models/svt/ormMulta';
import models from '../../../models';
import database from '../../../utils/database';

const db = database.getInstance();

export class daoMultaSpeedControlImplementation
  implements DaoInterfaceGeneric<eMultaSpeedControl>
{
  async get(id: number): Promise<eMultaSpeedControl | null> {
    const ormObj: ormMultaSpeedControl =
      await dbOrm.ormMultaSpeedControl.findByPk(id);
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
    const ormObj: ormMultaSpeedControl =
      await dbOrm.ormMultaSpeedControl.findOne({
        where: { id_multa },
        include: [
          {
            model: models.ormMulta,
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
      multaBase.id_veicolo,
      multaBase.id_automobilista,
      multaBase.is_notturno,
      multaBase.is_recidivo,
      multaBase.stato,
      ormObj.speed,
      ormObj.speed_real,
      ormObj.speed_limit,
      ormObj.speed_delta,
    );
  }

  async getAllWithMulta(options?: {
    where?: any;
    transaction?: Transaction;
  }): Promise<eMultaSpeedControl[]> {
    const ormObjs: ormMultaSpeedControl[] =
      await dbOrm.ormMultaSpeedControl.findAll({
        where: options?.where, // Applica il filtro passato in options
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
        multaBase.id_veicolo,
        multaBase.id_automobilista,
        multaBase.is_notturno,
        multaBase.is_recidivo,
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
    const objs: ormMultaSpeedControl[] =
      await dbOrm.ormMultaSpeedControl.findAll(options);
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
      await dbOrm.ormMultaSpeedControl.create(
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
      const [speedControlUpdatedRows] = await dbOrm.ormMultaSpeedControl.update(
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
      const deletedSpeedControlRows = await dbOrm.ormMultaSpeedControl.destroy({
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

  async getImportoMulta(id_multa: number): Promise<number | null> {
    const query = `
      SELECT
        (CASE WHEN m.is_notturno THEN
            s.costo_min * 1.3
          ELSE
            s.costo_min
          END) * 
        (CASE WHEN m.is_recidivo THEN 
            2 ELSE 1
        END) AS importo_calcolato
      FROM  svt_multa m
      LEFT JOIN svt_multa_speed_control ms ON m.id = ms.id_multa
      LEFT JOIN svt_plc_policy spp ON m.id_policy =spp.id 
      LEFT JOIN svt_plc_speed_control spssc ON spp.id = spssc.id_policy 
      LEFT JOIN svt_transito t ON m.id_transito = t.id
      LEFT JOIN svt_plc_sanction_speed_control spc ON 
      ms.speed_delta > spc.speed_min AND ms.speed_delta <= spc.speed_max
      AND t.meteo = spssc.meteo 
      LEFT JOIN svt_plc_sanction s ON s.id = spc.id_policy_sanction
      WHERE m.tipo_policy = 'speed control' AND m.id=:id_multa;
    `;

    const rawResults = await db.query(query, {
      replacements: { id_multa },
      type: QueryTypes.SELECT,
    });

    // Mappiamo ogni risultato su ePolicySanctionSpeedControl
    const results = rawResults.map((data: any) => data.importo_calcolato);

    // Verifica se c'è un risultato e ritorna il valore
    return results[0];
  }

  async getAllMulteSpeedControlToAutomobilista(
    dataInizio: Date,
    dataFine: Date,
    arrayTarghe: string[],
    idUtente: number,
  ): Promise<eMultaSpeedControl[] | null> {
    let result = null;

    try {
      const rawMulte = await db.query(
        `SELECT t_mlt.*,t_mlt_sc.*
         FROM svt_multa t_mlt
         LEFT JOIN svt_multa_speed_control t_mlt_sc ON (t_mlt.id=t_mlt_sc.id_multa)
         LEFT JOIN svt_veicolo vc ON (t_mlt.id_veicolo = vc.id)
         LEFT JOIN svt_transito trn ON (t_mlt.id_transito=trn.id)
         WHERE t_mlt.id_automobilista=:id_utente AND 
         vc.targa IN (:targhe) AND (trn.data_transito >= :dataInizio AND trn.data_transito <= :dataFine);`,
        {
          replacements: {
            targhe: arrayTarghe,
            dataInizio: dataInizio,
            dataFine: dataFine,
            id_utente: idUtente,
          },
          type: QueryTypes.SELECT,
        },
      );

      const objMulte: eMultaSpeedControl[] | null = rawMulte.map((multa) => {
        return eMultaSpeedControl.fromJSON(multa);
      });

      result = objMulte;
    } catch (error) {
      throw new Error('getAllMulteToAutomobilista error: ' + error);
    }
    return result;
  }

  async getAllMulteSpeedControlToOperatore(
    dataInizio: Date,
    dataFine: Date,
    arrayTarghe: string[],
  ): Promise<eMultaSpeedControl[] | null> {
    let result = null;

    try {
      const rawMulte = await db.query(
        `SELECT t_mlt.*,t_mlt_sc.* 
         FROM svt_multa t_mlt 
         LEFT JOIN svt_multa_speed_control t_mlt_sc ON (t_mlt.id=t_mlt_sc.id_multa) 
         LEFT JOIN svt_veicolo vc ON (t_mlt.id_veicolo = vc.id) 
         LEFT JOIN svt_transito trn ON (t_mlt.id_transito=trn.id) 
         WHERE vc.targa IN (:targhe) AND (trn.data_transito >= :dataInizio AND trn.data_transito <= :dataFine);`,
        {
          replacements: {
            targhe: arrayTarghe,
            dataInizio: dataInizio, // Format to 'YYYY-MM-DD HH:mm:ss'
            dataFine: dataFine,
          },
          type: QueryTypes.SELECT,
        },
      );

      const objMulte: eMultaSpeedControl[] | null = rawMulte.map((multa) => {
        return eMultaSpeedControl.fromJSON(multa);
      });

      result = objMulte;
    } catch (error) {
      throw new Error('getAllMulteToOperatore error: ' + error);
    }
    return result;
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoMultaSpeedControl = new daoMultaSpeedControlImplementation();
