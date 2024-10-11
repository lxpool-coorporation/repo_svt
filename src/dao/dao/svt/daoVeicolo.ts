import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import { eVeicolo } from '../../../entity/svt/eVeicolo';
import { ormVeicolo } from '../../../models/svt/ormVeicolo';
import sequelize from 'sequelize';
import { Op, Transaction } from 'sequelize';
import dbOrm from '../../../models'; // Importa tutti i modelli e l'istanza Sequelize
import { eUtente } from '../../../entity/utente/eUtente';

// Implementazione del DAO per l'entità `Veicolo`
export class daoVeicoloImplementation implements DaoInterfaceGeneric<eVeicolo> {
  // Trova un Veicolo per ID usando Sequelize
  async get(id: number): Promise<eVeicolo | null> {
    //await new Promise((resolve) => setTimeout(resolve, 1000));
    const ormObj = await dbOrm.ormVeicolo.findByPk(id, { raw: true });
    if (!ormObj) {
      throw new Error(`Veicolo non trovato per l'id ${id}`);
    }
    return new eVeicolo(ormObj.id, ormObj.tipo, ormObj.targa, ormObj.stato);
  }

  async getByTarga(cf: string): Promise<eVeicolo | null> {
    let ret: eVeicolo | null = null;
    const ormObj = await dbOrm.ormVeicolo.findOne({
      where: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn('LOWER', sequelize.col('targa')),
            cf.toLowerCase(),
          ),
        ],
      },
    });
    if (!!ormObj) {
      ret = new eVeicolo(ormObj.id, ormObj.tipo, ormObj.targa, ormObj.stato);
    }
    return ret;
  }
  // Trova tutti gli utenti usando Sequelize
  async getAll(options?: object): Promise<eVeicolo[]> {
    const objs = await dbOrm.ormVeicolo.findAll(options);
    return objs.map(
      (ormObj: ormVeicolo) =>
        new eVeicolo(ormObj.id, ormObj.tipo, ormObj.targa, ormObj.stato),
    );
  }

  // Salva un nuovo Veicolo nel database usando Sequelize
  async save(
    t: eVeicolo,
    options?: { transaction?: Transaction },
  ): Promise<eVeicolo | null> {
    const ormObj = await dbOrm.ormVeicolo.create(
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
    const ormObj = await dbOrm.ormVeicolo.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('Veicolo not found');
    }

    // Imposto le opzioni di default o applico quelle fornite dall'svt
    const defaultOptions = {
      where: { id: t.get_id() },
      //fields: ['tipo', 'targa', 'stato'], // Campi aggiornabili di default
      returning: true,
      //individualHooks: true,
      validate: true,
    };

    // Combina le opzioni di default con quelle passate dall'esterno
    const updateOptions = { ...defaultOptions, ...options };
    await dbOrm.ormVeicolo.update(
      {
        tipo: t.get_tipo(),
        targa: t.get_targa(),
        stato: t.get_stato(),
      },
      updateOptions,
    );
  }

  // Elimina un Veicolo dal database usando Sequelize
  async delete(
    t: eVeicolo,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    const ormObj = await dbOrm.ormVeicolo.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('Veicolo not found');
    }
    await ormObj.destroy({ transaction: options?.transaction });
  }

  public async getUtenteByIdVeicolo(
    idVeicolo: number,
  ): Promise<eUtente | null> {
    let result: eUtente | null = null;

    try {
      const ormVeicolo = await dbOrm.ormVeicolo.findByPk(idVeicolo, {
        include: [
          {
            model: dbOrm.ormUtente,
            as: 'veicolo_utenti', // Assicurati che questo sia l'alias corretto definito nell'associazione
          },
        ],
      });

      if (!ormVeicolo) {
        throw new Error('Veicolo non trovato');
      }

      // Se ci sono utenti associati, restituiscili
      // Se c'è almeno un utente associato, restituisci il primo
      if (ormVeicolo.veicolo_utenti && ormVeicolo.veicolo_utenti.length > 0) {
        const utente = eUtente.fromJSON(ormVeicolo.veicolo_utenti[0]);
        result = utente;
      }
    } catch (error) {
      throw error;
    }
    return result;
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoVeicolo = new daoVeicoloImplementation();
