import type { Building, SearchField } from '../model/types.ts';
import { BUILDING_TYPE_LABELS } from './labels.ts';

export const matchesSearch = (
  building: Building,
  field: SearchField,
  query: string
): boolean => {
  const q = query.trim().toLowerCase();
  if (q === '') return true;

  if (field === 'type') {
    return BUILDING_TYPE_LABELS[building.type].toLowerCase().includes(q);
  }

  //const value = String(building[field];)

  const value = building[field];

  if (typeof value === 'number') {
    return value === Number(q.replace(',', '.'));
  }

  return value.toLowerCase().includes(q);
};