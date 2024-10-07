import { DaoInterfaceGeneric } from '../../../dao/interfaces/generic/daoInterfaceGeneric';
import { ePermesso } from '../../../entity/utente/ePermesso';
import { Transaction } from 'sequelize';

import dbOrm from '../../../models'; // Importa tutti i modelli e l'istanza Sequelize
import { ormPermesso } from '../../../models/utente/ormPermesso';

// Implementazione del DAO per l'entità `Permesso`
export class daoPermessoImplementation
  implements DaoInterfaceGeneric<ePermesso>
{
  // Trova un Permesso per ID usando Sequelize
  async get(id: number): Promise<ePermesso | null> {
    const ormObj = await dbOrm.ormPermesso.findByPk(id);
    if (!ormObj) {
      throw new Error(`Permesso non trovato per l'id ${id}`);
    }
    return new ePermesso(
      ormObj.id,
      ormObj.categoria,
      ormObj.tipo,
      ormObj.cod,
      ormObj.descrizione,
      ormObj.stato,
    );
  }

  // Trova tutti gli utenti usando Sequelize
  async getAll(options?: object): Promise<ePermesso[]> {
    const objs: ormPermesso[] = await dbOrm.ormPermesso.findAll(options);
    return objs.map(
      (ormObj) =>
        new ePermesso(
          ormObj.id,
          ormObj.categoria,
          ormObj.tipo,
          ormObj.cod,
          ormObj.descrizione,
          ormObj.stato,
        ),
    );
  }

  // Salva un nuovo Permesso nel database usando Sequelize
  async save(
    t: ePermesso,
    options?: { transaction?: Transaction },
  ): Promise<ePermesso | null> {
    const ormObj = await dbOrm.ormPermesso.create(
      {
        id: t.get_id(),
        categoria: t.get_categoria(),
        tipo: t.get_tipo(),
        cod: t.get_cod(),
        descrizione: t.get_descrizione(),
        stato: t.get_stato(),
      },
      { transaction: options?.transaction },
    );
    return new ePermesso(
      ormObj.id,
      ormObj.categoria,
      ormObj.tipo,
      ormObj.cod,
      ormObj.descrizione,
      ormObj.stato,
    );
  }

  // Aggiorna un utente esistente nel database
  async update(
    t: ePermesso,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    const ormObj = await dbOrm.ormPermesso.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('Permesso not found');
    }

    // Imposto le opzioni di default o applico quelle fornite dall'utente
    const defaultOptions = {
      where: { id: t.get_id() },
      fields: ['cod', 'descrizione', 'stato'], // Campi aggiornabili di default
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
        stato: t.get_stato(),
        // Aggiungi altri campi che devono essere aggiornati
      },
      updateOptions,
    );
  }

  // Elimina un Permesso dal database usando Sequelize
  async delete(
    t: ePermesso,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    const ormObj = await dbOrm.ormPermesso.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('Permesso not found');
    }
    await ormObj.destroy({ transaction: options?.transaction });
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoPermesso = new daoPermessoImplementation();
