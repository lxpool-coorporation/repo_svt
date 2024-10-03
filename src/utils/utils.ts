export function isString(value: any): value is string {
  return typeof value === 'string';
}
export function isNumeric(value: any): value is number {
  return typeof value === 'number';
}

export function StringisNumeric(val: string): boolean {
  return !isNaN(Number(val));
}
