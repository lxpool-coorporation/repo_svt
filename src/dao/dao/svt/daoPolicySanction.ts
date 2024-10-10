import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import { ePolicySanction } from '../../../entity/svt/ePolicySanction';
import { Transaction } from 'sequelize';

import dbOrm from '../../../models'; // Importa tutti i modelli e l'istanza Sequelize
import { ormPolicySanction } from '../../../models/svt/ormPolicySanction';

// Implementazione del DAO per l'entità `PolicySanction`
export class daoPolicySanctionImplementation
  implements DaoInterfaceGeneric<ePolicySanction>
{
  // Trova un PolicySanction per ID usando Sequelize
  async get(id: number): Promise<ePolicySanction | null> {
    const ormObj = await dbOrm.ormPolicySanction.findByPk(id);
    if (!ormObj) {
      throw new Error(`PolicySanction non trovato per l'id ${id}`);
    }
    return new ePolicySanction(
      ormObj.id,
      ormObj.tipo_policy,
      ormObj.cod,
      ormObj.descrizione,
      ormObj.costo_min,
      ormObj.costo_max,
      ormObj.costo_punti_patente,
      ormObj.stato,
    );
  }

  // Trova tutti gli utenti usando Sequelize
  async getAll(options?: object): Promise<ePolicySanction[]> {
    const objs: ormPolicySanction[] =
      await dbOrm.ormPolicySanction.findAll(options);
    return objs.map(
      (ormObj) =>
        new ePolicySanction(
          ormObj.id,
          ormObj.tipo_policy,
          ormObj.cod,
          ormObj.descrizione,
          ormObj.costo_min,
          ormObj.costo_max,
          ormObj.costo_punti_patente,
          ormObj.stato,
        ),
    );
  }

  // Salva un nuovo PolicySanction nel database usando Sequelize
  async save(
    t: ePolicySanction,
    options?: { transaction?: Transaction },
  ): Promise<ePolicySanction | null> {
    const ormObj = await dbOrm.ormPolicySanction.create(
      {
        id: t.get_id(),
        tipo: t.get_tipo_policy(),
        cod: t.get_cod(),
        descrizione: t.get_descrizione(),
        costo_min: t.get_costo_min(),
        costo_max: t.get_costo_max(),
        costo_punti_patente: t.get_costo_punti_patente(),
        stato: t.get_stato(),
      },
      { transaction: options?.transaction },
    );
    return new ePolicySanction(
      ormObj.id,
      ormObj.tipo_policy,
      ormObj.cod,
      ormObj.descrizione,
      ormObj.costo_min,
      ormObj.costo_max,
      ormObj.costo_punti_patente,
      ormObj.stato,
    );
  }

  // Aggiorna un utente esistente nel database
  async update(
    t: ePolicySanction,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    const ormObj = await dbOrm.ormPolicySanction.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('PolicySanction not found');
    }

    // Imposto le opzioni di default o applico quelle fornite dall'utente
    const defaultOptions = {
      where: { id: t.get_id() },
      fields: [
        'tipo_policy',
        'veicolo',
        'cod',
        'descrizione',
        'costo_min',
        'costo_max',
        'costo_punti_patente',
        'stato',
      ], // Campi aggiornabili di default
      returning: true,
      //individualHooks: true,
      validate: true,
    };

    // Combina le opzioni di default con quelle passate dall'esterno
    const updateOptions = { ...defaultOptions, ...options };

    await dbOrm.ormPolicySanction.update(
      {
        id: t.get_id(),
        tipo_policy: t.get_tipo_policy(),
        cod: t.get_cod(),
        descrizione: t.get_descrizione(),
        costo_min: t.get_costo_min(),
        costo_max: t.get_costo_max(),
        costo_punti_patente: t.get_costo_punti_patente(),
        stato: t.get_stato(),
      },
      updateOptions,
    );
  }

  // Elimina un PolicySanction dal database usando Sequelize
  async delete(
    t: ePolicySanction,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    const ormObj = await dbOrm.ormPolicySanction.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('PolicySanction not found');
    }
    await ormObj.destroy({
      transaction: options?.transaction,
    });
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoPolicySanction = new daoPolicySanctionImplementation();
