export function error(check: boolean, paramName: string, type: string, value: any) {
  if (check) return;
  throw new Error(errorText(paramName, type, value));
}

export function errorText(paramName: string, type: string, value: any): string {
  return `The "${paramName}" must be of ${type}. Received type ${typeof value} (${value})`;
}