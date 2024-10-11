import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import { eTratta } from '../../../entity/svt/eTratta';
import { Transaction } from 'sequelize';

import dbOrm from '../../../models'; // Importa tutti i modelli e l'istanza Sequelize
import { ormTratta } from '../../../models/svt/ormTratta';

// Implementazione del DAO per l'entità `Tratta`
export class daoTrattaImplementation implements DaoInterfaceGeneric<eTratta> {
  // Trova un Tratta per ID usando Sequelize
  async get(id: number): Promise<eTratta | null> {
    const ormObj = await dbOrm.ormTratta.findByPk(id);
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
    const objs: ormTratta[] = await dbOrm.ormTratta.findAll(options);
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
    const ormObj = await dbOrm.ormTratta.create(
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
    const ormObj = await dbOrm.ormTratta.findByPk(t.get_id(), {
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
      //individualHooks: true,
      validate: true,
    };

    // Combina le opzioni di default con quelle passate dall'esterno
    const updateOptions = { ...defaultOptions, ...options };

    await dbOrm.ormTratta.update(
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
    const ormObj = await dbOrm.ormTratta.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('Tratta not found');
    }
    await ormObj.destroy({ transaction: options?.transaction });
  }

  public async getTrattaByIdVarcoUscita(
    idVarcoUscita: number,
  ): Promise<eTratta | null> {
    try {
      const ormObj = await ormTratta.findOne({
        where: {
          id_varco_uscita: idVarcoUscita,
        },
      });

      if (!ormObj) {
        throw new Error(
          'Tratta non trovata per id varco uscita: ' + idVarcoUscita,
        );
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
    } catch (error) {
      throw error;
    }

    return null;
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoTratta = new daoTrattaImplementation();
