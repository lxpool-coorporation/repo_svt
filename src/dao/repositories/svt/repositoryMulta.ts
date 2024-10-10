import { eMultaSpeedControl } from '../../../entity/svt/eMultaSpeedControl';
import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import {
  daoMultaSpeedControl,
  daoMultaSpeedControlImplementation,
} from '../../dao/svt/daoMultaSpeedControl';
import { Op, Transaction } from 'sequelize';
import database from '../../../utils/database';
import { daoMulta, daoMultaImplementation } from '../../dao/svt/daoMulta';
import { eMulta } from '../../../entity/svt/eMulta';
import {
  daoBollettino,
  daoBollettinoImplementation,
} from '../../../dao/dao/svt/daoBollettino';
import { eBollettino } from '../../../entity/svt/eBollettino';
import { enumBollettinoStato } from '../../../entity/enum/enumBollettinoStato';
import { v4 as uuidv4 } from 'uuid';
import messenger from '../../../utils/messenger';
import { enumMessengerCoda } from '../../../entity/enum/enumMessengerCoda';

const db = database.getInstance();

class repositoryMultaImplementation implements DaoInterfaceGeneric<eMulta> {
  private daoMulta: daoMultaImplementation;
  private daoMultaSpeedControl: daoMultaSpeedControlImplementation;
  private daoBollettino: daoBollettinoImplementation;

  constructor() {
    this.daoMulta = daoMulta;
    this.daoMultaSpeedControl = daoMultaSpeedControl;
    this.daoBollettino = daoBollettino;
  }
  get(id: number): Promise<eMulta | null> {
    return this.daoMulta.get(id);
  }
  getAll(options?: object): Promise<eMulta[]> {
    return this.daoMulta.getAll(options);
  }
  async save(t: eMulta): Promise<eMulta | null> {
    return this.daoMulta.save(t);
  }
  update(t: eMultaSpeedControl): Promise<void> {
    return this.daoMultaSpeedControl.update(t);
  }
  delete(t: eMultaSpeedControl): Promise<void> {
    return this.daoMultaSpeedControl.delete(t);
  }

  // Metodi MultaSpeedControl

  getMultaSpeedControl(id: number): Promise<eMultaSpeedControl | null> {
    return this.daoMultaSpeedControl.getWithMulta(id);
  }

  getAllMultaSpeedControl(options?: object): Promise<eMultaSpeedControl[]> {
    return this.daoMultaSpeedControl.getAllWithMulta(options);
  }

  async saveMultaSpeedControl(
    t: eMultaSpeedControl,
  ): Promise<eMultaSpeedControl | null> {
    const transaction: Transaction = await db.transaction();

    try {
      const options = { transaction };

      // Salva la multa base
      const multaBase = await daoMulta.save(t, options);
      if (!multaBase) {
        throw new Error('Failed to save base multa.');
      }

      t.set_id(multaBase.get_id());

      // Salva la multa speed control
      const multaSpeedControl = await this.daoMultaSpeedControl.save(
        t,
        options,
      );
      if (!multaSpeedControl) {
        throw new Error('Failed to save multa speed control.');
      }

      await transaction.commit();

      return new eMultaSpeedControl(
        multaBase.get_id(),
        multaBase.get_id_transito(),
        multaBase.get_id_policy(),
        multaBase.get_tipo_policy(),
        multaBase.get_id_automobilista(),
        multaBase.get_is_notturno(),
        multaBase.get_is_recidivo(),
        multaBase.get_stato(),
        multaSpeedControl.get_speed(),
        multaSpeedControl.get_speed_real(),
        multaSpeedControl.get_speed_limit(),
        multaSpeedControl.get_speed_delta(),
      );
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateMultaSpeedControl(t: eMultaSpeedControl): Promise<void> {
    const transaction: Transaction = await db.transaction();

    try {
      const options = { transaction };

      // Aggiorna la multa base
      await this.daoMulta.update(t, options);

      // Aggiorna la multa speed control
      await this.daoMultaSpeedControl.update(t, options);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deleteMultaSpeedControl(t: eMultaSpeedControl): Promise<void> {
    const transaction: Transaction = await db.transaction();

    try {
      const options = { transaction };

      // Elimina la multa speed control
      await daoMultaSpeedControl.delete(t, options);

      // Elimina la multa base
      await daoMulta.delete(t, options);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Elimina un MultaSpeedControl
  async getAllMulteSpeedControlByIdAutomobilista(
    idAutomobilista: number,
  ): Promise<boolean> {
    const result = await this.getAllMultaSpeedControl({
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 6)), // Ultimi 6 mesi
        },
      },
      includeWhere: {
        id_automobilista: idAutomobilista, // Filtro sul modello associato
      },
    });
    return result.length > 0;
  }

  // METODI BOLLETTINO

  getBollettinoById(id: number): Promise<eBollettino | null> {
    return this.daoBollettino.get(id);
  }
  getAllBollettini(options?: object): Promise<eBollettino[]> {
    return this.daoBollettino.getAll(options);
  }
  async saveBellettino(t: eBollettino): Promise<eBollettino | null> {
    return this.daoBollettino.save(t);
  }
  async updateBollettino(t: eBollettino): Promise<void> {
    return this.daoBollettino.update(t);
  }
  deleteBollettino(t: eBollettino): Promise<void> {
    return this.daoBollettino.delete(t);
  }

  async getImportoMulta(idMulta: number): Promise<number | null> {
    return daoMultaSpeedControl.getImportoMulta(idMulta);
  }

  async richiediBollettino(idMulta: number): Promise<eBollettino | null> {
    let result: eBollettino | null = null;

    try {
      const multa: eMultaSpeedControl | null =
        await this.getMultaSpeedControl(idMulta);
      if (!multa) {
        throw new Error(
          `errore in richiesta bollettino: multa con id ${idMulta}`,
        );
      } else {
        const uuidPagamento: string = uuidv4(); // Genera UUID univoco per il pagamento
        const importo: number | null = await this.getImportoMulta(
          multa.get_id(),
        );
        if (!importo) {
          throw new Error(
            `errore in richiesta bollettino: importo non calcolato per multa: ${multa.get_id()}`,
          );
        }

        const bollettino = new eBollettino(
          0,
          multa.get_id(),
          uuidPagamento,
          importo,
          null,
          enumBollettinoStato.richiesto,
        );
        result = await this.saveBellettino(bollettino);
        if (!result) {
          throw new Error(
            `errore in richiesta bollettino: errore in generazione per multa: ${multa.get_id()}`,
          );
        } else {
          const rabbitMQ = messenger.getInstance();

          // Connessione a RabbitMQ
          await rabbitMQ.connect();

          // Invia un messaggio alla coda 'tasks_queue'
          await rabbitMQ.sendToQueue(
            enumMessengerCoda.queueBollettino,
            JSON.stringify(result),
          );
        }
      }
    } catch (err) {
      throw new Error('errore in richiesta bollettino:' + err);
    }

    return result;
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const repositoryMulta = new repositoryMultaImplementation();
