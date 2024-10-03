export interface DaoInterfaceGeneric<T> {
  get(id: number): Promise<T | null>;
  getAll(options?: object): Promise<T[]>;
  save(t: T): Promise<T | null>;
  update(t: T, options?: object): Promise<void>;
  delete(t: T): Promise<void>;
}
