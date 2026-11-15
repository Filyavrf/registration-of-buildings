import type { Building } from '../model/types.ts';

export const normalizeAddress = (address: string): string =>
  address.trim().replace(/\s+/g, ' ').toLowerCase();

export const isAddressTaken = (
  items: Building[],
  address: string,
  excludeId?: string
): boolean => {
  const target = normalizeAddress(address);
  return items.some(
    (building) => building.id !== excludeId && normalizeAddress(building.address) === target
  );
};