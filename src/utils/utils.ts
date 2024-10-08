export function isString(value: any): value is string {
  return typeof value === 'string';
}
export function isNumeric(value: any): value is number {
  return !isNaN(Number(value));
}

export function StringisNumeric(val: string): boolean {
  return !isNaN(Number(val));
}
