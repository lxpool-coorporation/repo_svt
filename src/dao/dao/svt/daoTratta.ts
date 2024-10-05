import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import { ormTratta } from '../../../models/svt/ormTratta';
import { eTratta } from '../../../entity/svt/eTratta';
import { Transaction } from 'sequelize';

// Implementazione del DAO per l'entità `Tratta`
export class daoTrattaImplementation implements DaoInterfaceGeneric<eTratta> {
  // Trova un Tratta per ID usando Sequelize
  async get(id: number): Promise<eTratta | null> {
    const ormObj = await ormTratta.findByPk(id);
    if (!ormObj) {
      throw new Error(`Tratta non trovato per l'id ${id}`);
    }
    return new eTratta(
      ormObj.id,
      ormObj.cod,
      ormObj.descrizione,
      ormObj.id_varco_ingresso,
      ormObj.id_varco_uscita,
      ormObj.distanza,
      ormObj.stato,
    );
  }

  // Trova tutti gli utenti usando Sequelize
  async getAll(options?: object): Promise<eTratta[]> {
    const objs = await ormTratta.findAll(options);
    return objs.map(
      (ormObj) =>
        new eTratta(
          ormObj.id,
          ormObj.cod,
          ormObj.descrizione,
          ormObj.id_varco_ingresso,
          ormObj.id_varco_uscita,
          ormObj.distanza,
          ormObj.stato,
        ),
    );
  }

  // Salva un nuovo Tratta nel database usando Sequelize
  async save(
    t: eTratta,
    options?: { transaction?: Transaction },
  ): Promise<eTratta | null> {
    const ormObj = await ormTratta.create(
      {
        id: t.get_id(),
        cod: t.get_cod(),
        descrizione: t.get_descrizione(),
        id_varco_ingresso: t.get_id_varco_ingresso(),
        id_varco_uscita: t.get_id_varco_uscita(),
        distanza: t.get_distanza(),
        stato: t.get_stato(),
      },
      { transaction: options?.transaction },
    );
    return new eTratta(
      ormObj.id,
      ormObj.cod,
      ormObj.descrizione,
      ormObj.id_varco_ingresso,
      ormObj.id_varco_uscita,
      ormObj.distanza,
      ormObj.stato,
    );
  }

  // Aggiorna un utente esistente nel database
  async update(
    t: eTratta,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    const ormObj = await ormTratta.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('Tratta not found');
    }

    // Imposto le opzioni di default o applico quelle fornite dall'utente
    const defaultOptions = {
      where: { id: t.get_id() },
      fields: [
        'cod',
        'descrizione',
        'id_varco_ingresso',
        'id_varco_uscita',
        'stato',
      ], // Campi aggiornabili di default
      returning: true,
      individualHooks: true,
      validate: true,
    };

    // Combina le opzioni di default con quelle passate dall'esterno
    const updateOptions = { ...defaultOptions, ...options };

    await ormObj.update(
      {
        cod: t.get_cod(),
        descrizione: t.get_descrizione(),
        id_varco_ingresso: t.get_id_varco_ingresso(),
        id_varco_uscita: t.get_id_varco_uscita(),
        distanza: t.get_distanza(),
        stato: t.get_stato(),
      },
      updateOptions,
    );
  }

  // Elimina un Tratta dal database usando Sequelize
  async delete(
    t: eTratta,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    const ormObj = await ormTratta.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('Tratta not found');
    }
    await ormObj.destroy({ transaction: options?.transaction });
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoTratta = new daoTrattaImplementation();
