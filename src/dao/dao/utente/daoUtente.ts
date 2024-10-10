import sequelize from 'sequelize';
import { DaoInterfaceGeneric } from '../../../dao/interfaces/generic/daoInterfaceGeneric';
import { eUtente } from '../../../entity/utente/eUtente';
import { Op, Transaction } from 'sequelize';

import dbOrm from '../../../models'; // Importa tutti i modelli e l'istanza Sequelize
import { ormUtente } from '../../../models/utente/ormUtente';
import { eVeicolo } from '../../../entity/svt/eVeicolo';
import { eProfilo } from '../../../entity/utente/eProfilo';
import { enumStato } from '../../../entity/enum/enumStato';

// Implementazione del DAO per l'entità `Utente`
export class daoUtenteImplementation implements DaoInterfaceGeneric<eUtente> {
  // Trova un utente per ID usando Sequelize
  async get(id: number): Promise<eUtente | null> {
    const ormObj = await dbOrm.ormUtente.findByPk(id);
    if (!ormObj) {
      throw new Error(`utente non trovato per l'id ${id}`);
    }
    return new eUtente(ormObj.id, ormObj.identificativo, ormObj.stato);
  }

  async getByIdentificativo(cf: string): Promise<eUtente | null> {
    let ret: eUtente | null = null;
    const ormObj = await dbOrm.ormUtente.findOne({
      where: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn('LOWER', sequelize.col('identificativo')),
            cf.toLowerCase(),
          ),
        ],
      },
    });
    if (!!ormObj) {
      ret = new eUtente(ormObj.id, ormObj.identificativo, ormObj.stato);
    }
    return ret;
  }

  // Trova tutti gli utenti usando Sequelize
  async getAll(options?: object): Promise<eUtente[]> {
    const objs: ormUtente[] = await dbOrm.ormUtente.findAll(options);
    return objs.map(
      (ormObj) => new eUtente(ormObj.id, ormObj.identificativo, ormObj.stato),
    );
  }

  // Salva un nuovo utente nel database usando Sequelize
  async save(
    t: eUtente,
    options?: { transaction?: Transaction },
  ): Promise<eUtente | null> {
    const ormObj = await dbOrm.ormUtente.create(
      {
        id: t.get_id(),
        identificativo: t.get_identificativo(),
        stato: t.get_stato(),
      },
      { transaction: options?.transaction },
    );
    return new eUtente(ormObj.id, ormObj.identificativo, ormObj.stato);
  }

  // Aggiorna un utente esistente nel database
  async update(
    t: eUtente,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    const ormObj = await dbOrm.ormUtente.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('Utente not found');
    }

    // Imposto le opzioni di default o applico quelle fornite dall'utente
    const defaultOptions = {
      where: { id: t.get_id() },
      fields: ['identificativo', 'id_stato'], // Campi aggiornabili di default
      returning: true,
      ////individualHooks: true,
      validate: true,
    };

    // Combina le opzioni di default con quelle passate dall'esterno
    const updateOptions = { ...defaultOptions, ...options };

    await ormObj.update(
      {
        identificativo: t.get_identificativo(),
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
    const ormObj = await dbOrm.ormUtente.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('Utente not found');
    }
    await ormObj.destroy({ transaction: options?.transaction });
  }

  public async getProfiliByIdUtente(
    idUtente: number,
  ): Promise<eProfilo[] | null> {
    try {
      const Utente = await ormUtente.findByPk(idUtente, {
        include: [
          {
            model: dbOrm.ormProfilo,
            as: 'utente_profili', // Questo deve corrispondere all'alias definito nell'associazione
          },
        ],
      });

      if (!Utente) {
        throw new Error('Utente non trovato');
      }

      if (Utente.utente_profili) {
        return Utente.utente_profili.map((a) => {
          return new eProfilo(
            a.id,
            a.cod,
            a.descrizione,
            a.enum_profilo,
            a.stato,
          );
        });
      }

      //return Utente.Utente_permessi; // Qui Sequelize popola automaticamente i permessi associati
    } catch (error) {
      console.error(
        'Errore durante il recupero dei profili per Utente:',
        error,
      );
      throw error;
    }

    return null;
  }

  public async getVeicoliByIdUtente(
    idUtente: number,
  ): Promise<eVeicolo[] | null> {
    try {
      const Utente = await ormUtente.findByPk(idUtente, {
        include: [
          {
            model: dbOrm.ormVeicolo,
            as: 'utente_veicoli', // Questo deve corrispondere all'alias definito nell'associazione
          },
        ],
      });

      if (!Utente) {
        throw new Error('Utente non trovato');
      }

      if (Utente.utente_veicoli) {
        return Utente.utente_veicoli.map((a) => {
          return new eVeicolo(a.id, a.tipo, a.targa, a.stato);
        });
      }

      //return Utente.Utente_permessi; // Qui Sequelize popola automaticamente i permessi associati
    } catch (error) {
      console.error(
        'Errore durante il recupero dei permessi per il Utente:',
        error,
      );
      throw error;
    }

    return null;
  }

  public async saveUtentiProfili(
    utente: eUtente,
    profili: eProfilo[],
    options?: { transaction?: Transaction },
  ): Promise<Boolean> {
    let result = false;
    try {
      profili.forEach(async (prf) => {
        await dbOrm.ormUtenteProfilo.create(
          {
            id_utente: utente.get_id(),
            id_profilo: prf.get_id(),
            stato: enumStato.attivo,
          },
          { transaction: options?.transaction },
        );
      });

      result = true;

      //return Utente.Utente_permessi; // Qui Sequelize popola automaticamente i permessi associati
    } catch (error) {
      console.error(
        'Errore durante il recupero dei permessi per il Utente:',
        error,
      );
      throw error;
    }

    return result;
  }

  public async saveUtentiVeicoli(
    utente: eUtente,
    veicoli: eVeicolo[],
    options?: { transaction?: Transaction },
  ): Promise<Boolean> {
    let result = false;
    try {
      veicoli.forEach(async (prf) => {
        await dbOrm.ormUtenteVeicolo.create(
          {
            id_utente: utente.get_id(),
            id_veicolo: prf.get_id(),
            stato: enumStato.attivo,
          },
          { transaction: options?.transaction },
        );
      });

      result = true;

      //return Utente.Utente_permessi; // Qui Sequelize popola automaticamente i permessi associati
    } catch (error) {
      console.error(
        'Errore durante il recupero dei permessi per il Utente:',
        error,
      );
      throw error;
    }

    return result;
  }

  // Elimina un'associazione tra utente e veicolo dal database usando Sequelize
  async deleteAssociazioneUtenteVeicolo(
    idUtente: number,
    idVeicolo: number,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    // Trova l'associazione nella tabella ormUtenteVeicolo
    const ormAssociazione = await dbOrm.ormUtenteVeicolo.findOne({
      where: {
        id_utente: idUtente,
        id_veicolo: idVeicolo,
      },
      transaction: options?.transaction,
    });

    // Se l'associazione non esiste, lancia un errore
    if (!ormAssociazione) {
      throw new Error('Associazione Utente-Veicolo non trovata');
    }

    // Elimina l'associazione
    await ormAssociazione.destroy({ transaction: options?.transaction });
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoUtente = new daoUtenteImplementation();
