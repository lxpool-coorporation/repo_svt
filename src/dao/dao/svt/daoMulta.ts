import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import { eMulta } from '../../../entity/svt/eMulta';
import { QueryTypes, Transaction } from 'sequelize';

import dbOrm from '../../../models'; // Importa tutti i modelli e l'istanza Sequelize
import { ormMulta } from '../../../models/svt/ormMulta';
import { enumPolicyTipo } from '../../../entity/enum/enumPolicyTipo';
import { enumMultaStato } from '../../../entity/enum/enumMultaStato';
import database from '../../../utils/database';


const db = database.getInstance();

// Implementazione del DAO per l'entità `Multa`
export class daoMultaImplementation implements DaoInterfaceGeneric<eMulta> {
  // Trova un Multa per ID usando Sequelize
  async get(id: number): Promise<eMulta | null> {
    const ormObj = await dbOrm.ormMulta.findByPk(id);
    if (!ormObj) {
      throw new Error(`Multa non trovato per l'id ${id}`);
    }
    return new eMulta(
      ormObj.id,
      ormObj.id_transito,
      ormObj.id_policy,
      ormObj.tipo_policy,
      ormObj.id_veicolo,
      ormObj.id_automobilista,
      ormObj.is_notturno,
      ormObj.is_recidivo,
      ormObj.stato,
    );
  }

  // Trova tutti gli utenti usando Sequelize
  async getAll(options?: object): Promise<eMulta[]> {
    const objs: ormMulta[] = await dbOrm.ormMulta.findAll(options);
    return objs.map(
      (ormObj) =>
        new eMulta(
          ormObj.id,
          ormObj.id_transito,
          ormObj.id_policy,
          ormObj.tipo_policy,
          ormObj.id_veicolo,
          ormObj.id_automobilista,
          ormObj.is_notturno,
          ormObj.is_recidivo,
          ormObj.stato,
        ),
    );
  }

  // Salva un nuovo Multa nel database usando Sequelize
  async save(
    t: eMulta,
    options?: { transaction?: Transaction },
  ): Promise<eMulta | null> {
    const ormObj = await dbOrm.ormMulta.create(
      {
        id_transito: t.get_id_transito(),
        id_policy: t.get_id_policy(),
        tipo_policy: t.get_tipo_policy(),
        id_veicolo: t.get_id_veicolo(),
        id_automobilista: t.get_id_automobilista(),
        is_notturno: t.get_is_notturno(),
        is_recidivo: t.get_is_recidivo(),
        stato: t.get_stato(),
      },
      { transaction: options?.transaction },
    );
    return new eMulta(
      ormObj.id,
      ormObj.id_transito,
      ormObj.id_policy,
      ormObj.tipo_policy,
      ormObj.id_veicolo,
      ormObj.id_automobilista,
      ormObj.is_notturno,
      ormObj.is_recidivo,
      ormObj.stato,
    );
  }

  // Aggiorna un utente esistente nel database
  async updateFields(
    t: eMulta,
    fieldsToUpdate: Partial<{
      id_transito: number | null,
      id_policy: number | null,
      tipo_policy: enumPolicyTipo | null,
      id_veicolo: number | null,
      id_automobilista: number | null,
      is_notturno: boolean | null,
      is_recidivo: boolean | null,
      stato: enumMultaStato | null,
    }>,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    const ormObj = await dbOrm.ormMulta.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('Multa not found');
    }

    // Solo i campi presenti in fieldsToUpdate verranno aggiornati
    const updatedFields = {
      ...(fieldsToUpdate.id_transito !== undefined && {
        id_transito: fieldsToUpdate.id_transito,
      }),
      ...(fieldsToUpdate.id_policy !== undefined && {
        id_policy: fieldsToUpdate.id_policy,
      }),
      ...(fieldsToUpdate.tipo_policy !== undefined && {
        tipo_policy: fieldsToUpdate.tipo_policy,
      }),
      ...(fieldsToUpdate.id_veicolo !== undefined && {
        id_veicolo: fieldsToUpdate.id_veicolo,
      }),
      ...(fieldsToUpdate.id_automobilista !== undefined && {
        id_automobilista: fieldsToUpdate.id_automobilista,
      }),
      ...(fieldsToUpdate.is_notturno !== undefined && {
        is_notturno: fieldsToUpdate.is_notturno,
      }),
      ...(fieldsToUpdate.is_recidivo !== undefined && {
        is_recidivo: fieldsToUpdate.is_recidivo,
      }),
      ...(fieldsToUpdate.stato !== undefined && {
        stato: fieldsToUpdate.stato,
      }),
    };

    // Se non ci sono campi da aggiornare, non fare nulla
    if (Object.keys(updatedFields).length === 0) {
      return;
    }

    // Imposta le opzioni di default o applica quelle fornite dall'utente
    const defaultOptions = {
      where: { id: t.get_id() },
      returning: true,
      validate: true,
      transaction: options?.transaction,
    };

    // Combina le opzioni di default con quelle passate dall'esterno
    const updateOptions = { ...defaultOptions, ...options };

    await dbOrm.ormMulta.update(updatedFields, updateOptions);
  }

  // Aggiorna un utente esistente nel database
  async update(
    t: eMulta,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    const ormObj = await dbOrm.ormMulta.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('Multa not found');
    }

    // Imposto le opzioni di default o applico quelle fornite dall'utente
    const defaultOptions = {
      where: { id: t.get_id() },
      fields: [
        'id_transito',
        'id_policy',
        'tipo_policy',
        'id_veicolo',
        'id_automobilista',
        'is_notturno',
        'is_recidivo',
        'stato',
      ], // Campi aggiornabili di default
      returning: true,
      ////individualHooks: true,
      validate: true,
    };

    // Combina le opzioni di default con quelle passate dall'esterno
    const updateOptions = { ...defaultOptions, ...options };

    await ormObj.ormMulta.update(
      {
        id_transito: t.get_id_transito(),
        id_policy: t.get_id_policy(),
        tipo_policy: t.get_tipo_policy(),
        id_veicolo: t.get_id_veicolo(),
        id_automobilista: t.get_id_automobilista(),
        is_notturno: t.get_is_notturno(),
        is_recidivo: t.get_is_recidivo(),
        stato: t.get_stato(),
      },
      updateOptions,
    );
  }

  // Elimina un Multa dal database usando Sequelize
  async delete(
    t: eMulta,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    const ormObj = await dbOrm.ormMulta.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('Multa not found');
    }
    await ormObj.destroy({ transaction: options?.transaction });
  }

  async getAllMultePendingByTarga(
      targa: string,
    ): Promise<eMulta[] | null> {
      let result = null;

      try {
        const rawMulte = await db.query(
          `SELECT t_mlt.*
           FROM svt_multa t_mlt
           LEFT JOIN svt_veicolo vc ON (t_mlt.id_veicolo = vc.id)
           WHERE t_mlt.id_automobilista is NULL AND vc.targa=:targa;`,
          {
            replacements: { targa: targa },
            type: QueryTypes.SELECT,
          },
        );

        const objMulte:eMulta[]|null = rawMulte.map((multa) => {
            return eMulta.fromJSON(multa);
        });
        
        result = objMulte;
      } catch (error) {
        throw new Error('getAllMultePendingByTarga error: ' + error);
      }
      return result;
    }

}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoMulta = new daoMultaImplementation();
