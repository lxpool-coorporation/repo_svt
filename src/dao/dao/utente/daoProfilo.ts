import { DaoInterfaceGeneric } from '../../../dao/interfaces/generic/daoInterfaceGeneric';
import { eProfilo } from '../../../entity/utente/eProfilo';
import { Transaction } from 'sequelize';

import dbOrm from '../../../models'; // Importa tutti i modelli e l'istanza Sequelize
import { ormProfilo } from '../../../models/utente/ormProfilo';
import { ePermesso } from '../../../entity/utente/ePermesso';

// Implementazione del DAO per l'entità `Profilo`
export class daoProfiloImplementation implements DaoInterfaceGeneric<eProfilo> {
  // Trova un profilo per ID usando Sequelize
  async get(id: number): Promise<eProfilo | null> {
    const ormObj = await dbOrm.ormProfilo.findByPk(id);
    if (!ormObj) {
      throw new Error(`profilo non trovato per l'id ${id}`);
    }
    return new eProfilo(
      ormObj.id,
      ormObj.cod,
      ormObj.descrizione,
      ormObj.stato,
    );
  }

  // Trova tutti gli utenti usando Sequelize
  async getAll(options?: object): Promise<eProfilo[]> {
    const objs: ormProfilo[] = await ormProfilo.findAll(options);
    return objs.map(
      (ormObj) =>
        new eProfilo(ormObj.id, ormObj.cod, ormObj.descrizione, ormObj.stato),
    );
  }

  // Salva un nuovo profilo nel database usando Sequelize
  async save(
    t: eProfilo,
    options?: { transaction?: Transaction },
  ): Promise<eProfilo | null> {
    const ormObj = await ormProfilo.create(
      {
        id: t.get_id(),
        cod: t.get_cod(),
        descrizione: t.get_descrizione(),
        stato: t.get_stato(),
      },
      { transaction: options?.transaction },
    );
    return new eProfilo(
      ormObj.id,
      ormObj.cod,
      ormObj.descrizione,
      ormObj.stato,
    );
  }

  // Aggiorna un utente esistente nel database
  async update(
    t: eProfilo,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    const ormObj = await ormProfilo.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('Profilo not found');
    }

    // Imposto le opzioni di default o applico quelle fornite dall'utente
    const defaultOptions = {
      where: { id: t.get_id() },
      fields: ['cod', 'descrizione', 'stato'], // Campi aggiornabili di default
      returning: true,
      //individualHooks: true,
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

  // Elimina un profilo dal database usando Sequelize
  async delete(
    t: eProfilo,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    const ormObj = await ormProfilo.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('Profilo not found');
    }
    await ormObj.destroy({ transaction: options?.transaction });
  }

  public async getPermessiByProfilo(
    idProfilo: number,
  ): Promise<ePermesso[] | null> {
    try {
      const profilo = await ormProfilo.findByPk(idProfilo, {
        include: [
          {
            model: dbOrm.ormPermesso,
            as: 'profilo_permessi', // Questo deve corrispondere all'alias definito nell'associazione
          },
        ],
      });

      if (!profilo) {
        throw new Error('Profilo non trovato');
      }

      if (profilo.profilo_permessi) {
        return profilo.profilo_permessi.map((a) => {
          return new ePermesso(
            a.id,
            a.categoria,
            a.tipo,
            a.cod,
            a.descrizione,
            a.stato,
          );
        });
      }

      //return profilo.profilo_permessi; // Qui Sequelize popola automaticamente i permessi associati
    } catch (error) {
      console.error(
        'Errore durante il recupero dei permessi per il profilo:',
        error,
      );
      throw error;
    }
    return null;
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoProfilo = new daoProfiloImplementation();
