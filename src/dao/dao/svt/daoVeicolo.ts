import { DaoInterfaceGeneric } from '../../../dao/interfaces/generic/daoInterfaceGeneric';
import { eVeicolo } from '../../../entity/svt/eVeicolo';
import { ormVeicolo } from '../../../models/svt/ormVeicolo';
import { Transaction } from 'sequelize';

// Implementazione del DAO per l'entità `Veicolo`
export class daoVeicoloImplementation implements DaoInterfaceGeneric<eVeicolo> {
  // Trova un Veicolo per ID usando Sequelize
  async get(id: number): Promise<eVeicolo | null> {
    const ormObj = await ormVeicolo.findByPk(id);
    if (!ormObj) {
      throw new Error(`Veicolo non trovato per l'id ${id}`);
    }
    return new eVeicolo(ormObj.id, ormObj.tipo, ormObj.targa, ormObj.stato);
  }

  // Trova tutti gli utenti usando Sequelize
  async getAll(options?: object): Promise<eVeicolo[]> {
    const objs = await ormVeicolo.findAll(options);
    return objs.map(
      (ormObj) =>
        new eVeicolo(ormObj.id, ormObj.tipo, ormObj.targa, ormObj.stato),
    );
  }

  // Salva un nuovo Veicolo nel database usando Sequelize
  async save(
    t: eVeicolo,
    options?: { transaction?: Transaction },
  ): Promise<eVeicolo | null> {
    const existingVeicolo = await ormVeicolo.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (existingVeicolo) {
      throw new Error('A User with the specified id already exists');
    }
    const ormObj = await ormVeicolo.create(
      {
        id: t.get_id(),
        tipo: t.get_tipo(),
        targa: t.get_targa(),
        stato: t.get_stato(),
      },
      { transaction: options?.transaction },
    );
    return new eVeicolo(ormObj.id, ormObj.tipo, ormObj.targa, ormObj.stato);
  }

  // Aggiorna un svt esistente nel database
  async update(
    t: eVeicolo,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    const ormObj = await ormVeicolo.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('Veicolo not found');
    }

    // Imposto le opzioni di default o applico quelle fornite dall'svt
    const defaultOptions = {
      where: { id: t.get_id() },
      fields: ['tipo', 'targa', 'stato'], // Campi aggiornabili di default
      returning: true,
      individualHooks: true,
      validate: true,
    };

    // Combina le opzioni di default con quelle passate dall'esterno
    const updateOptions = { ...defaultOptions, ...options };

    await ormObj.update(
      {
        tipo: t.get_tipo(),
        targa: t.get_targa(),
        stato: t.get_stato(),
        // Aggiungi altri campi che devono essere aggiornati
      },
      updateOptions,
    );
  }

  // Elimina un Veicolo dal database usando Sequelize
  async delete(
    t: eVeicolo,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    const ormObj = await ormVeicolo.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('Veicolo not found');
    }
    await ormObj.destroy({ transaction: options?.transaction });
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoVeicolo = new daoVeicoloImplementation();
