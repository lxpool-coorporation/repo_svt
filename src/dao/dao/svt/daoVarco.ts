import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import { ormVarco } from '../../../models/svt/ormVarco';
import { eVarco } from '../../../entity/svt/eVarco';
import { Transaction } from 'sequelize';

// Implementazione del DAO per l'entità `Varco`
export class daoVarcoImplementation implements DaoInterfaceGeneric<eVarco> {
  // Trova un Varco per ID usando Sequelize
  async get(id: number): Promise<eVarco | null> {
    const ormObj = await ormVarco.findByPk(id);
    if (!ormObj) {
      throw new Error(`Varco non trovato per l'id ${id}`);
    }
    console.log(ormObj);
    return new eVarco(
      ormObj.dataValues.id,
      ormObj.dataValues.cod,
      ormObj.dataValues.descrizione,
      ormObj.dataValues.latitudine
        ? parseFloat(ormObj.dataValues.latitudine)
        : 0,
      ormObj.dataValues.longitudine
        ? parseFloat(ormObj.dataValues.longitudine)
        : 0,
      ormObj.dataValues.stato,
    );
  }

  // Trova tutti gli utenti usando Sequelize
  async getAll(options?: object): Promise<eVarco[]> {
    const objs = await ormVarco.findAll(options);
    return objs.map(
      (ormObj) =>
        new eVarco(
          ormObj.dataValues.id,
          ormObj.dataValues.cod,
          ormObj.dataValues.descrizione,
          ormObj.dataValues.latitudine
            ? parseFloat(ormObj.dataValues.latitudine)
            : 0,
          ormObj.dataValues.longitudine
            ? parseFloat(ormObj.dataValues.longitudine)
            : 0,
          ormObj.dataValues.stato,
        ),
    );
  }

  // Salva un nuovo Varco nel database usando Sequelize
  async save(
    t: eVarco,
    options?: { transaction?: Transaction },
  ): Promise<eVarco | null> {
    const ormObj = await ormVarco.create(
      {
        id: t.get_id(),
        cod: t.get_cod(),
        descrizione: t.get_descrizione(),
        latitudine: t.get_latitudine(),
        longitudine: t.get_longitudine(),
        stato: t.get_stato(),
      },
      { transaction: options?.transaction },
    );
    return new eVarco(
      ormObj.dataValues.id,
      ormObj.dataValues.cod,
      ormObj.dataValues.descrizione,
      ormObj.dataValues.latitudine
        ? parseFloat(ormObj.dataValues.latitudine)
        : 0,
      ormObj.dataValues.longitudine
        ? parseFloat(ormObj.dataValues.longitudine)
        : 0,
      ormObj.dataValues.stato,
    );
  }

  // Aggiorna un utente esistente nel database
  async update(
    t: eVarco,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    const ormObj = await ormVarco.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('Varco not found');
    }

    // Imposto le opzioni di default o applico quelle fornite dall'utente
    const defaultOptions = {
      where: { id: t.get_id() },
      fields: ['cod', 'descrizione', 'latitudine', 'longitudine', 'stato'], // Campi aggiornabili di default
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
        latitudine: t.get_latitudine(),
        longitudine: t.get_longitudine(),
        stato: t.get_stato(),
      },
      updateOptions,
    );
  }

  // Elimina un Varco dal database usando Sequelize
  async delete(
    t: eVarco,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    const ormObj = await ormVarco.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('Varco not found');
    }
    await ormObj.destroy({ transaction: options?.transaction });
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoVarco = new daoVarcoImplementation();
