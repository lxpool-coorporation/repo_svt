import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import { eMulta } from '../../../entity/svt/eMulta';
import { Transaction } from 'sequelize';

import dbOrm from '../../../models'; // Importa tutti i modelli e l'istanza Sequelize
import { ormMulta } from '../../../models/svt/ormMulta';

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
    await ormObj.ormMulta.destroy({ transaction: options?.transaction });
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoMulta = new daoMultaImplementation();
