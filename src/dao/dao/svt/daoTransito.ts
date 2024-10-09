import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import { eTransito, eTransitoBuilder } from '../../../entity/svt/eTransito';
import { Transaction } from 'sequelize';
import dbOrm from '../../../models'; // Importa tutti i modelli e l'istanza Sequelize
import { ormTransito } from '../../../models/svt/ormTransito';

// Implementazione del DAO per l'entità `Transito`
export class daoTransitoImplementation
  implements DaoInterfaceGeneric<eTransito>
{
  // Trova un Transito per ID usando Sequelize
  async get(id: number): Promise<eTransito | null> {
    const ormObj = await dbOrm.ormTransito.findByPk(id);
    if (!ormObj) {
      throw new Error(`Transito non trovato per l'id ${id}`);
    }
    return new eTransito(
      new eTransitoBuilder()
        .setId(ormObj.id)
        .setDataTransito(ormObj.data_transito)
        .setSpeed(ormObj.speed)
        .setSpeedReal(ormObj.speed_real)
        .setIdVarco(ormObj.id_varco)
        .setMeteo(ormObj.meteo)
        .setIdVeicolo(ormObj.id_veicolo)
        .setpath_immagine(ormObj.path_immagine)
        .setStato(ormObj.stato),
    );
  }

  // Trova tutti gli utenti usando Sequelize
  async getAll(options?: object): Promise<eTransito[]> {
    const objs: ormTransito[] = await dbOrm.ormTransito.findAll(options);
    return objs.map(
      (ormObj) =>
        new eTransito(
          new eTransitoBuilder()
            .setId(ormObj.id)
            .setDataTransito(ormObj.data_transito)
            .setSpeed(ormObj.speed)
            .setSpeedReal(ormObj.speed_real)
            .setIdVarco(ormObj.id_varco)
            .setMeteo(ormObj.meteo)
            .setIdVeicolo(ormObj.id_veicolo)
            .setpath_immagine(ormObj.path_immagine)
            .setStato(ormObj.stato),
        ),
    );
  }

  // Salva un nuovo Transito nel database usando Sequelize
  async save(
    t: eTransito,
    options?: { transaction?: Transaction },
  ): Promise<eTransito | null> {
    const ormObj = await dbOrm.ormTransito.create(
      {
        id: t.get_id(),
        data_transito: t.get_data_transito(),
        speed: t.get_speed(),
        speed_real: t.get_speed_real(),
        id_varco: t.get_id_varco(),
        meteo: t.get_meteo(),
        id_veicolo: t.get_id_veicolo(),
        path_immagine: t.get_path_immagine(),
        stato: t.get_stato(),
      },
      { transaction: options?.transaction },
    );
    return new eTransito(
      new eTransitoBuilder()
        .setId(ormObj.id)
        .setDataTransito(ormObj.data_transito)
        .setSpeed(ormObj.speed)
        .setSpeedReal(ormObj.speed_real)
        .setIdVarco(ormObj.id_varco)
        .setMeteo(ormObj.meteo)
        .setIdVeicolo(ormObj.id_veicolo)
        .setpath_immagine(ormObj.path_immagine)
        .setStato(ormObj.stato),
    );
  }

  // Aggiorna un utente esistente nel database
  async update(
    t: eTransito,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    const ormObj = await dbOrm.ormTransito.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('Transito not found');
    }

    // Imposto le opzioni di default o applico quelle fornite dall'utente
    const defaultOptions = {
      where: { id: t.get_id() },
      fields: [
        'data_transito',
        'speed',
        'speed_real',
        'id_varco',
        'meteo',
        'id_veicolo',
        'path_immagine',
        'stato',
      ], // Campi aggiornabili di default
      returning: true,
      //individualHooks: true,
      validate: true,
    };

    // Combina le opzioni di default con quelle passate dall'esterno
    const updateOptions = { ...defaultOptions, ...options };

    await dbOrm.ormTransito.update(
      {
        data_transito: t.get_data_transito(),
        speed: t.get_speed(),
        speed_real: t.get_speed_real(),
        id_varco: t.get_id_varco(),
        meteo: t.get_meteo(),
        id_veicolo: t.get_id_veicolo(),
        path_immagine: t.get_path_immagine(),
        stato: t.get_stato(),
      },
      updateOptions,
    );
  }

  // Elimina un Transito dal database usando Sequelize
  async delete(
    t: eTransito,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    const ormObj = await dbOrm.ormTransito.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('Transito not found');
    }
    await ormObj.destroy({ transaction: options?.transaction });
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoTransito = new daoTransitoImplementation();
