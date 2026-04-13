export function transformToNumber(value: string): number {
  if (!value) {
    return 0;
  }
  const numericValue = Number(value);

  if (isNaN(numericValue)) {
    return 0;
  }

  return numericValue;
}
