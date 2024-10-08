// daoPolicySpeedControl.ts
import { ePolicySpeedControl } from '../../../entity/svt/ePolicySpeedControl';
import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import { QueryTypes, Transaction } from 'sequelize';

import dbOrm from '../../../models'; // Importa tutti i modelli e l'istanza Sequelize
import { ormPolicy } from '../../../models/svt/ormPolicy';
import { ormPolicySpeedControl } from '../../../models/svt/ormPolicySpeedControl';
import { enumMeteoTipo } from '../../../entity/enum/enumMeteoTipo';
import database from '../../../utils/database';

const db = database.getInstance();

export class daoPolicySpeedControlImplementation
  implements DaoInterfaceGeneric<ePolicySpeedControl>
{
  async get(id: number): Promise<ePolicySpeedControl | null> {
    const ormObj = await dbOrm.ormPolicySpeedControl.findByPk(id);
    if (!ormObj) {
      throw new Error(`Policy non trovato per l'id ${id}`);
    }
    return new ePolicySpeedControl(
      ormObj.id_policy,
      null,
      null,
      null,
      null,
      ormObj.meteo,
      ormObj.veicolo,
      ormObj.speed_limit,
    );
  }

  async getWithPolicy(
    id_policy: number,
    options?: { transaction?: Transaction },
  ): Promise<ePolicySpeedControl | null> {
    const ormObj = await dbOrm.ormPolicySpeedControl.findOne({
      where: { id_policy },
      include: [
        {
          model: ormPolicy,
          as: 'policy',
        },
      ],
      transaction: options?.transaction,
    });

    if (!ormObj || !ormObj.policy) {
      return null;
    }

    const policyBase = ormObj.policy;
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

  async getAllWithPolicy(options?: {
    transaction?: Transaction;
  }): Promise<ePolicySpeedControl[]> {
    const ormObjs: ormPolicySpeedControl[] =
      await dbOrm.ormPolicySpeedControl.findAll({
        include: [
          {
            model: ormPolicy,
            as: 'policy',
          },
        ],
        transaction: options?.transaction,
      });

    return ormObjs.map((ormObj) => {
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
    });
  }

  // Trova tutti gli utenti usando Sequelize
  async getAll(options?: object): Promise<ePolicySpeedControl[]> {
    const objs: ormPolicySpeedControl[] =
      await dbOrm.ormPolicySpeedControl.findAll(options);
    return objs.map((item) => {
      return new ePolicySpeedControl(
        item.id_policy,
        null,
        null,
        null,
        null,
        item.meteo,
        item.veicolo,
        item.speed_limit,
      );
    });
  }

  // Salva un nuovo PolicySpeedControl nel database usando Sequelize
  async save(
    t: ePolicySpeedControl,
    options?: { transaction?: Transaction },
  ): Promise<ePolicySpeedControl | null> {
    try {
      // Crea la policy speed control
      await dbOrm.ormPolicySpeedControl.create(
        {
          id_policy: t.get_id(),
          meteo: t.get_meteo(),
          veicolo: t.get_veicolo(),
          speed_limit: t.get_speed_limit(),
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
    t: ePolicySpeedControl,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    try {
      // Aggiorna la policy speed control
      const [speedControlUpdatedRows] =
        await dbOrm.ormPolicySpeedControl.update(
          {
            meteo: t.get_meteo(),
            veicolo: t.get_veicolo(),
            speed_limit: t.get_speed_limit(),
          },
          {
            where: { id_policy: t.get_id() },
            transaction: options?.transaction,
          },
        );

      if (speedControlUpdatedRows === 0) {
        throw new Error(`PolicySpeedControl con ID ${t.get_id()} non trovata.`);
      }
    } catch (error) {
      throw error;
    }
  }

  // Elimina un PolicySpeedControl dal database usando Sequelize
  async delete(
    t: ePolicySpeedControl,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    try {
      // Elimina la policy speed control
      const deletedSpeedControlRows = await dbOrm.ormPolicySpeedControl.destroy(
        {
          where: { id_policy: t.get_id() },
          transaction: options?.transaction,
        },
      );

      if (deletedSpeedControlRows === 0) {
        throw new Error(`PolicySpeedControl con ID ${t.get_id()} non trovata.`);
      }
    } catch (error) {
      throw error;
    }
  }

  async getPoliciesByVarcoMeteoVeicolo(
    id_varco: number,
    meteo: enumMeteoTipo,
    id_veicolo: number,
  ): Promise<ePolicySpeedControl[] | null> {
    const query = `
      SELECT plc.*,psc.*
      FROM svt_varco_policy vp
      LEFT JOIN svt_plc_policy plc ON vp.id_policy = plc.id
      LEFT JOIN svt_plc_speed_control psc ON plc.id = psc.id_policy
      LEFT JOIN  svt_veicolo vcl ON psc.veicolo =vcl.tipo
      WHERE vp.id_varco = :id_varco
      AND psc.meteo = :meteo
      AND vcl.id = :id_veicolo
    `;

    const rawPolicies = await db.query(query, {
      replacements: { id_varco, meteo, id_veicolo },
      type: QueryTypes.SELECT,
    });

    // Mappiamo ogni risultato su ePolicySanctionSpeedControl
    const policies = rawPolicies.map((data: any) =>
      ePolicySpeedControl.fromJSON(data),
    );

    return policies;
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoPolicySpeedControl = new daoPolicySpeedControlImplementation();
