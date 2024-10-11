import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import { eBollettino } from '../../../entity/svt/eBollettino';
import { Op, Transaction } from 'sequelize';

import dbOrm from '../../../models'; // Importa tutti i modelli e l'istanza Sequelize
import { ormBollettino } from '../../../models/svt/ormBollettino';
import { enumBollettinoStato } from '../../../entity/enum/enumBollettinoStato';
import sequelize from 'sequelize';

// Implementazione del DAO per l'entità `Bollettino`
export class daoBollettinoImplementation
  implements DaoInterfaceGeneric<eBollettino>
{
  // Trova un Bollettino per ID usando Sequelize
  async get(id: number): Promise<eBollettino | null> {
    const ormObj = await dbOrm.ormBollettino.findByPk(id);
    if (!ormObj) {
      throw new Error(`Bollettino non trovato per l'id ${id}`);
    }
    return new eBollettino(
      ormObj.id,
      ormObj.id_multa,
      ormObj.uuid,
      ormObj.importo,
      ormObj.path_bollettino,
      ormObj.stato,
    );
  }

  async getBollettinoByUiid(uuid: string): Promise<eBollettino | null> {
    let ret: eBollettino | null = null;
    const ormObj = await dbOrm.ormBollettino.findOne({
      where: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn('LOWER', sequelize.col('uuid')),
            uuid.toLowerCase(),
          ),
        ],
      },
    });
    if (!!ormObj) {
      ret = new eBollettino(
        ormObj.id,
        ormObj.id_multa,
        ormObj.uuid,
        ormObj.importo,
        ormObj.path_bollettino,
        ormObj.stato,
      );
    }
    return ret;
  }

  async getByIdMulta(idMulta: number): Promise<eBollettino | null> {
    let ret: eBollettino | null = null;
    const ormObj = await dbOrm.ormBollettino.findOne({
      where: {
        id_multa: idMulta,
      },
    });
    if (!!ormObj) {
      ret = new eBollettino(
        ormObj.id,
        ormObj.id_multa,
        ormObj.uuid,
        ormObj.importo,
        ormObj.path_bollettino,
        ormObj.stato,
      );
    }
    return ret;
  }

  // Trova tutti gli utenti usando Sequelize
  async getAll(options?: object): Promise<eBollettino[]> {
    const objs: ormBollettino[] = await dbOrm.ormBollettino.findAll(options);
    return objs.map(
      (ormObj) =>
        new eBollettino(
          ormObj.id,
          ormObj.id_multa,
          ormObj.uuid,
          ormObj.importo,
          ormObj.path_bollettino,
          ormObj.stato,
        ),
    );
  }

  // Salva un nuovo Bollettino nel database usando Sequelize
  async save(
    t: eBollettino,
    options?: { transaction?: Transaction },
  ): Promise<eBollettino | null> {
    const ormObj = await dbOrm.ormBollettino.create(
      {
        id: t.get_id(),
        id_multa: t.get_id_multa(),
        uuid: t.get_uuid(),
        importo: t.get_importo(),
        path_bollettino: t.get_path_bollettino(),
        stato: t.get_stato(),
      },
      { transaction: options?.transaction },
    );
    return new eBollettino(
      ormObj.id,
      ormObj.id_multa,
      ormObj.uuid,
      ormObj.importo,
      ormObj.path_bollettino,
      ormObj.stato,
    );
  }

  // Aggiorna un utente esistente nel database
  async update(
    t: eBollettino,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    const ormObj = await dbOrm.ormBollettino.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('Bollettino not found');
    }

    // Imposto le opzioni di default o applico quelle fornite dall'utente
    const defaultOptions = {
      where: { id: t.get_id() },
      fields: ['id_multa', 'uuid', 'importo', 'stato'], // Campi aggiornabili di default
      returning: true,
      //individualHooks: true,
      validate: true,
    };

    // Combina le opzioni di default con quelle passate dall'esterno
    const updateOptions = { ...defaultOptions, ...options };

    await dbOrm.ormBollettino.update(
      {
        id: t.get_id(),
        id_multa: t.get_id_multa(),
        uuid: t.get_uuid(),
        importo: t.get_importo(),
        path_bollettino: t.get_path_bollettino(),
        stato: t.get_stato(),
      },
      updateOptions,
    );
  }

  // Aggiorna un utente esistente nel database
  async updateFields(
    t: eBollettino,
    fieldsToUpdate: Partial<{
      id_multa: number | null;
      uuid: string | null;
      importo: number | null;
      path_bollettino: string | null;
      stato: enumBollettinoStato | null;
    }>,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    const ormObj = await dbOrm.ormBollettino.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('Bollettino not found');
    }

    // Solo i campi presenti in fieldsToUpdate verranno aggiornati
    const updatedFields = {
      ...(fieldsToUpdate.id_multa !== undefined && {
        id_multa: fieldsToUpdate.id_multa,
      }),
      ...(fieldsToUpdate.uuid !== undefined && {
        uuid: fieldsToUpdate.uuid,
      }),
      ...(fieldsToUpdate.importo !== undefined && {
        importo: fieldsToUpdate.importo,
      }),
      ...(fieldsToUpdate.path_bollettino !== undefined && {
        path_bollettino: fieldsToUpdate.path_bollettino,
      }),
      ...(fieldsToUpdate.stato !== undefined && {
        stato: fieldsToUpdate.stato,
      }),
    };

    // Se non ci sono campi da aggiornare, non fare nulla
    // Se non ci sono campi da aggiornare, non fare nulla
    if (Object.keys(updatedFields).length === 0) {
      return;
    }

    // Imposta le opzioni di default o applica quelle fornite dall'utente
    const defaultOptions = {
      where: { id: t.get_id() },
      returning: true,
      validate: true,
      transaction: options?.transaction,
    };

    // Combina le opzioni di default con quelle passate dall'esterno
    const updateOptions = { ...defaultOptions, ...options };

    await dbOrm.ormBollettino.update(updatedFields, updateOptions);
  }

  // Elimina un Bollettino dal database usando Sequelize
  async delete(
    t: eBollettino,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    const ormObj = await dbOrm.ormBollettino.findByPk(t.get_id(), {
      transaction: options?.transaction,
    });
    if (!ormObj) {
      throw new Error('Bollettino not found');
    }
    await dbOrm.ormBollettino.destroy({ transaction: options?.transaction });
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoBollettino = new daoBollettinoImplementation();
