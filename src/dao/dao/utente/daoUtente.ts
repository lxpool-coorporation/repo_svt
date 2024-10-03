import sequelize from 'sequelize';
import { DaoInterfaceGeneric } from '../../../dao/interfaces/generic/daoInterfaceGeneric';
import { eUtente } from '../../../entity/utente/eUtente';
import { ormUtente } from '../../../models/utente/ormUtente';
import { Op, Transaction } from 'sequelize';

// Implementazione del DAO per l'entità `Utente`
export class daoUtenteImplementation implements DaoInterfaceGeneric<eUtente> {
  // Trova un utente per ID usando Sequelize
  async get(id: number): Promise<eUtente | null> {
    const ormObj = await ormUtente.findByPk(id);
    if (!ormObj) {
      throw new Error(`utente non trovato per l'id ${id}`);
    }
    return new eUtente(ormObj.id, ormObj.codice_fiscale, ormObj.stato);
  }

  async getByCF(cf: string): Promise<eUtente | null> {
    const ormObj = await ormUtente.findOne({
      where: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn('LOWER', sequelize.col('codice_fiscale')),
            cf.toLowerCase(),
          ),
        ],
      },
    });
    if (!ormObj) {
      throw new Error(`utente non trovato per cf ${cf}`);
    }
    console.log(3);
    return new eUtente(ormObj.id, ormObj.codice_fiscale, ormObj.stato);
  }

  // Trova tutti gli utenti usando Sequelize
  async getAll(options?: object): Promise<eUtente[]> {
    const objs = await ormUtente.findAll(options);
    return objs.map(
      (ormObj) => new eUtente(ormObj.id, ormObj.codice_fiscale, ormObj.stato),
    );
  }

  // Salva un nuovo utente nel database usando Sequelize
  async save(
    t: eUtente,
    options?: { transaction?: Transaction },
  ): Promise<eUtente | null> {
    const existingUtente = await ormUtente.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (existingUtente) {
      throw new Error('A User with the specified id already exists');
    }
    const ormObj = await ormUtente.create(
      {
        id: t.get_id(),
        codice_fiscale: t.get_codiceFiscale(),
        stato: t.get_stato(),
      },
      { transaction: options?.transaction },
    );
    return new eUtente(ormObj.id, ormObj.codice_fiscale, ormObj.stato);
  }

  // Aggiorna un utente esistente nel database
  async update(t: eUtente, options?: object): Promise<void> {
    const ormObj = await ormUtente.findByPk(t.get_id());
    if (!ormObj) {
      throw new Error('Utente not found');
    }

    // Imposto le opzioni di default o applico quelle fornite dall'utente
    const defaultOptions = {
      where: { id: t.get_id() },
      fields: ['codice_fiscale', 'id_stato'], // Campi aggiornabili di default
      returning: true,
      individualHooks: true,
      validate: true,
    };

    // Combina le opzioni di default con quelle passate dall'esterno
    const updateOptions = { ...defaultOptions, ...options };

    await ormObj.update(
      {
        codice_fiscale: t.get_codiceFiscale(),
        id_stato: t.get_stato(),
        // Aggiungi altri campi che devono essere aggiornati
      },
      updateOptions,
    );
  }

  // Elimina un utente dal database usando Sequelize
  async delete(
    t: eUtente,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    const ormObj = await ormUtente.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('Utente not found');
    }
    await ormObj.destroy({ transaction: options?.transaction });
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoUtente = new daoUtenteImplementation();
