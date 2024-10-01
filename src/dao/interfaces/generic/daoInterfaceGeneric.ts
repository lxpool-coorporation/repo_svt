export interface DaoInterfaceGeneric<T> {
  get(id: number): Promise<T | null>;
  getAll(): Promise<T[]>;
  save(t: T): Promise<T | null>;
  update(t: T, ...params: string[]): Promise<void>;
  delete(t: T): Promise<void>;
}
