import { create } from 'zustand';
import type { Building, BuildingDraft, SortState, BuildingType } from './types.ts';
import { buildingRepository } from '../api/buildingRepository.ts';

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

  seedMockData: () => void;
}

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
        const valA = a[key];
        const valB = b[key];

        if (typeof valA === 'string' && typeof valB === 'string') {
          return dir === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        if (typeof valA === 'number' && typeof valB === 'number') {
          return dir === 'asc' ? valA - valB : valB - valA;
        }

        return 0;
      });
    }

    return result;
  },
  seedMockData: () => {
    const streets = [
      'пр. Ленина',
      'ул. Пушкина',
      'пр. Фрунзе',
      'ул. Советская',
      'пр. Комсомольский',
      'ул. Сибирская',
      'ул. Киевская',
      'ул. Красноармейская',
    ];

    const types: BuildingType[] = ['residential', 'office', 'industrial', 'public'];

    const mockItems: Building[] = Array.from({ length: 50 }, (_, index) => {
      const street = streets[Math.floor(Math.random() * streets.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const floors = Math.floor(Math.random() * 20) + 1;

      return {
        id: crypto.randomUUID(),
        address: `${street}, д. ${index + 1}`,
        type,
        floors,
        apartments: type === 'residential' ? floors * Math.floor(Math.random() * 4 + 2) : 0,
        serviceLife: Math.floor(Math.random() * 40) + 15,
        yearsToRepair: Math.floor(Math.random() * 10) + 1,
      };
    });

    buildingRepository.saveAll(mockItems);
    set({ items: mockItems });
  },
}));