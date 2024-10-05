import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import { ePolicySpeedControlSanction } from '../../../entity/svt/ePolicySpeedControlSanction';
import { ormPolicySpeedControlSanction } from '../../../models/svt/ormPolicySpeedControlSanction';
import { Transaction } from 'sequelize';

// Implementazione del DAO per l'entità `PolicySpeedControlSanction`
export class daoPolicySpeedControlSanctionImplementation
  implements DaoInterfaceGeneric<ePolicySpeedControlSanction>
{
  // Trova un PolicySpeedControlSanction per ID usando Sequelize
  async get(id: number): Promise<ePolicySpeedControlSanction | null> {
    const ormObj = await ormPolicySpeedControlSanction.findByPk(id);
    if (!ormObj) {
      throw new Error(`PolicySpeedControlSanction non trovato per l'id ${id}`);
    }
    return new ePolicySpeedControlSanction(
      ormObj.id,
      ormObj.id_policy,
      ormObj.veicolo,
      ormObj.cod,
      ormObj.descrizione,
      ormObj.speed_min,
      ormObj.speed_max,
      ormObj.costo_min,
      ormObj.costo_max,
      ormObj.licenza_punti,
      ormObj.stato,
    );
  }

  // Trova tutti gli utenti usando Sequelize
  async getAll(options?: object): Promise<ePolicySpeedControlSanction[]> {
    const objs = await ormPolicySpeedControlSanction.findAll(options);
    return objs.map(
      (ormObj) =>
        new ePolicySpeedControlSanction(
          ormObj.id,
          ormObj.id_policy,
          ormObj.veicolo,
          ormObj.cod,
          ormObj.descrizione,
          ormObj.speed_min,
          ormObj.speed_max,
          ormObj.costo_min,
          ormObj.costo_max,
          ormObj.licenza_punti,
          ormObj.stato,
        ),
    );
  }

  // Salva un nuovo PolicySpeedControlSanction nel database usando Sequelize
  async save(
    t: ePolicySpeedControlSanction,
    options?: { transaction?: Transaction },
  ): Promise<ePolicySpeedControlSanction | null> {
    const existingPolicySpeedControlSanction =
      await ormPolicySpeedControlSanction.findByPk(t.get_id(), {
        transaction: options?.transaction,
      });
    if (existingPolicySpeedControlSanction) {
      throw new Error('A User with the specified id already exists');
    }
    const ormObj = await ormPolicySpeedControlSanction.create(
      {
        id: t.get_id(),
        id_policy: t.get_id_policy(),
        veicolo: t.get_veicolo(),
        cod: t.get_cod(),
        descrizione: t.get_descrizione(),
        speed_min: t.get_speed_min(),
        speed_max: t.get_speed_max(),
        costo_min: t.get_costo_min(),
        costo_max: t.get_costo_max(),
        licenza_punti: t.get_licenza_punti(),
        stato: t.get_stato(),
      },
      { transaction: options?.transaction },
    );
    return new ePolicySpeedControlSanction(
      ormObj.id,
      ormObj.id_policy,
      ormObj.veicolo,
      ormObj.cod,
      ormObj.descrizione,
      ormObj.speed_min,
      ormObj.speed_max,
      ormObj.costo_min,
      ormObj.costo_max,
      ormObj.licenza_punti,
      ormObj.stato,
    );
  }

  // Aggiorna un utente esistente nel database
  async update(
    t: ePolicySpeedControlSanction,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    const ormObj = await ormPolicySpeedControlSanction.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('PolicySpeedControlSanction not found');
    }

    // Imposto le opzioni di default o applico quelle fornite dall'utente
    const defaultOptions = {
      where: { id: t.get_id() },
      fields: [
        'id_policy',
        'veicolo',
        'cod',
        'descrizione',
        'speed_min',
        'speed_max',
        'costo_min',
        'costo_max',
        'stato',
      ], // Campi aggiornabili di default
      returning: true,
      individualHooks: true,
      validate: true,
    };

    // Combina le opzioni di default con quelle passate dall'esterno
    const updateOptions = { ...defaultOptions, ...options };

    await ormObj.update(
      {
        id: t.get_id(),
        id_policy: t.get_id_policy(),
        veicolo: t.get_veicolo(),
        cod: t.get_cod(),
        descrizione: t.get_descrizione(),
        speed_min: t.get_speed_min(),
        speed_max: t.get_speed_max(),
        costo_min: t.get_costo_min(),
        costo_max: t.get_costo_max(),
        licenza_punti: t.get_licenza_punti(),
        stato: t.get_stato(),
        // Aggiungi altri campi che devono essere aggiornati
      },
      updateOptions,
    );
  }

  // Elimina un PolicySpeedControlSanction dal database usando Sequelize
  async delete(
    t: ePolicySpeedControlSanction,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    const ormObj = await ormPolicySpeedControlSanction.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('PolicySpeedControlSanction not found');
    }
    await ormObj.destroy({ transaction: options?.transaction });
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoPolicySpeedControlSanction =
  new daoPolicySpeedControlSanctionImplementation();
