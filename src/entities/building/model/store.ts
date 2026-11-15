import { create } from 'zustand';
import type { Building, BuildingDraft, SortKey, SortState, BuildingType } from './types.ts';
import { buildingRepository } from '../api/buildingRepository.ts';
import { BUILDING_TYPE_LABELS } from '../lib/labels.ts';

interface BuildingState {
  items: Building[];
  searchQuery: string;
  filterType: BuildingType | 'all';
  sortState: SortState | null;

  add: (draft: BuildingDraft) => void;
  update: (id: string, patch: Partial<BuildingDraft>) => void;
  remove: (id: string) => void;
  removeMany: (ids: string[]) => void;

  setSearchQuery: (query: string) => void;
  setFilterType: (type: BuildingType | 'all') => void;
  setSortState: (sort: SortState | null) => void;

  getFilteredAndSortedItems: () => Building[];
}

const getSortValue = (item: Building, key: SortKey): string | number =>
  key === 'type' ? BUILDING_TYPE_LABELS[item.type] : item[key];

export const useBuildingStore = create<BuildingState>()((set, get) => ({
  items: buildingRepository.getAll(),
  searchQuery: '',
  filterType: 'all',
  sortState: null,

  add: (draft) => {
    const newBuilding: Building = {
      id: crypto.randomUUID(),
      ...draft,
    };
    const updated = [newBuilding, ...get().items];
    buildingRepository.saveAll(updated);
    set({ items: updated });
  },

  update: (id, patch) => {
    const updated = get().items.map((item) =>
      item.id === id ? { ...item, ...patch } : item
    );
    buildingRepository.saveAll(updated);
    set({ items: updated });
  },

  remove: (id) => {
    const updated = get().items.filter((item) => item.id !== id);
    buildingRepository.saveAll(updated);
    set({ items: updated });
  },

  removeMany: (ids) => {
    const updated = get().items.filter((item) => !ids.includes(item.id));
    buildingRepository.saveAll(updated);
    set({ items: updated });
  },

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilterType: (filterType) => set({ filterType }),
  setSortState: (sortState) => set({ sortState }),

  getFilteredAndSortedItems: () => {
    const { items, searchQuery, filterType, sortState } = get();

    let result = items.filter((item) => {
      const matchesSearch = item.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || item.type === filterType;
      return matchesSearch && matchesType;
    });

    if (sortState) {
      const { key, dir } = sortState;
      result = [...result].sort((a, b) => {
        const valA = getSortValue(a, key);
        const valB = getSortValue(b, key);

        if (typeof valA === 'string' && typeof valB === 'string') {
          const cmp = valA.localeCompare(valB, 'ru');
          return dir === 'asc' ? cmp : -cmp;
        }

        if (typeof valA === 'number' && typeof valB === 'number') {
          return dir === 'asc' ? valA - valB : valB - valA;
        }

        return 0;
      });
    }

    return result;
  },
}));