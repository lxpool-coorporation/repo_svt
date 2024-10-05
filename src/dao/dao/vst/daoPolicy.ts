import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import { ePolicy } from '../../../entity/vst/ePolicy';
import { ormPolicy } from '../../../models/vst/ormPolicy';
import { Transaction } from 'sequelize';

// Implementazione del DAO per l'entità `Policy`
export class daoPolicyImplementation implements DaoInterfaceGeneric<ePolicy> {
  // Trova un Policy per ID usando Sequelize
  async get(id: number): Promise<ePolicy | null> {
    const ormObj = await ormPolicy.findByPk(id);
    if (!ormObj) {
      throw new Error(`Policy non trovato per l'id ${id}`);
    }
    return new ePolicy(
      ormObj.id,
      ormObj.cod,
      ormObj.descrizione,
      ormObj.tipo,
      ormObj.stato,
    );
  }

  // Trova tutti gli utenti usando Sequelize
  async getAll(options?: object): Promise<ePolicy[]> {
    const objs = await ormPolicy.findAll(options);
    return objs.map(
      (ormObj) =>
        new ePolicy(
          ormObj.id,
          ormObj.cod,
          ormObj.descrizione,
          ormObj.tipo,
          ormObj.stato,
        ),
    );
  }

  // Salva un nuovo Policy nel database usando Sequelize
  async save(
    t: ePolicy,
    options?: { transaction?: Transaction },
  ): Promise<ePolicy | null> {
    const ormObj = await ormPolicy.create(
      {
        id: t.get_id(),
        cod: t.get_cod(),
        descrizione: t.get_descrizione(),
        tipo: t.get_tipo(),
        stato: t.get_stato(),
      },
      { transaction: options?.transaction },
    );
    return new ePolicy(
      ormObj.id,
      ormObj.cod,
      ormObj.descrizione,
      ormObj.tipo,
      ormObj.stato,
    );
  }

  // Aggiorna un utente esistente nel database
  async update(
    t: ePolicy,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    const ormObj = await ormPolicy.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('Policy not found');
    }

    // Imposto le opzioni di default o applico quelle fornite dall'utente
    const defaultOptions = {
      where: { id: t.get_id() },
      fields: ['cod', 'descrizione', 'tipo', 'stato'], // Campi aggiornabili di default
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
        tipo: t.get_tipo(),
        stato: t.get_stato(),
        // Aggiungi altri campi che devono essere aggiornati
      },
      updateOptions,
    );
  }

  // Elimina un Policy dal database usando Sequelize
  async delete(
    t: ePolicy,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    const ormObj = await ormPolicy.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('Policy not found');
    }
    await ormObj.destroy({ transaction: options?.transaction });
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoPolicy = new daoPolicyImplementation();
