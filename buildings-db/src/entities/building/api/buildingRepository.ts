import {
  writeJson,
  readJson,
} from "@/shared/lib/storage/storage.ts";
import type {Building} from "../model/types.ts";

const KEY = 'buildings:v1';

export const buildingRepository = {
  getAll: (): Building[] => readJson<Building[]>(KEY, []),
  saveAll: (items: Building[]): void => writeJson(KEY, items),
}
