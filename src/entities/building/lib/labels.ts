import type { BuildingType} from "../model/types.ts";

export const BUILDING_TYPE_LABELS: Record<BuildingType, string> = {
  residential: "Жилое",
  office: "Офисное",
  industrial: "Промышленное",
  public: "Публичное",
}