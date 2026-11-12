export type BuildingType =
  | 'residential' | 'office' | 'industrial' | 'public';

export interface Building {
  id: string;
  address: string;
  type: BuildingType;
  floors: number;
  apartments: number;
  serviceLife: number;
  yearsToRepair: number;
}

export type BuildingDraft = Omit<Building, 'id'>;
export type SortKey = Exclude<keyof Building, 'id'>;
export type SortState = { key: SortKey; dir: 'asc' | 'desc' };