import { ePolicySpeedControl } from '../../../entity/svt/ePolicySpeedControl';
import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import {
  daoPolicySpeedControl,
  daoPolicySpeedControlImplementation,
} from '../../dao/svt/daoPolicySpeedControl';
import {
  daoInitSvt,
  daoInitSvtImplementation,
} from '../../../dao/dao/svt/daoInitSvt';

class repositoryPolicySpeedControlImplementation
  implements DaoInterfaceGeneric<ePolicySpeedControl>
{
  private daoPolicySpeedControl: daoPolicySpeedControlImplementation;
  private daoInitSvt: daoInitSvtImplementation;

  constructor() {
    this.daoPolicySpeedControl = daoPolicySpeedControl;
    this.daoInitSvt = daoInitSvt;
  }
  get(id: number): Promise<ePolicySpeedControl | null> {
    return this.daoPolicySpeedControl.get(id);
  }
  getAll(options?: object): Promise<ePolicySpeedControl[]> {
    return this.daoPolicySpeedControl.getAll(options);
  }
  save(t: ePolicySpeedControl): Promise<ePolicySpeedControl | null> {
    return this.daoPolicySpeedControl.save(t);
  }
  update(t: ePolicySpeedControl): Promise<void> {
    return this.daoPolicySpeedControl.update(t);
  }
  delete(t: ePolicySpeedControl): Promise<void> {
    return this.daoPolicySpeedControl.delete(t);
  }

  init(options?: {
    force?: boolean;
    alter?: boolean;
    logging?: boolean;
  }): Promise<boolean> {
    return this.daoInitSvt.init(options);
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const repositoryPolicySpeedControl =
  new repositoryPolicySpeedControlImplementation();
