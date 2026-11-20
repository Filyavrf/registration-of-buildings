import type { BuildingType, SearchField } from '../model/types.ts';

export const BUILDING_TYPE_LABELS: Record<BuildingType, string> = {
  residential: 'Жилое',
  office: 'Офисное',
  industrial: 'Промышленное',
  public: 'Публичное',
};

export const FIELD_LABELS: Record<SearchField, string> = {
  address: 'Адрес',
  type: 'Тип здания',
  floors: 'Этажи',
  apartments: 'Квартиры',
  serviceLife: 'Срок эксплуатации',
  yearsToRepair: 'До кап. ремонта',
};