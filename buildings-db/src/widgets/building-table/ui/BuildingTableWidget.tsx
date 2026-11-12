import { useState } from 'react';
import { useBuildingStore } from '@/entities/building/model/store';
import { BuildingRow } from '@/entities/building/ui/BuildingRow';
import { BUILDING_TYPE_LABELS } from '@/entities/building/lib/labels';
import type { Building, BuildingType, SortKey } from '@/entities/building/model/types';
import styles from './BuildingTableWidget.module.scss';

interface BuildingTableWidgetProps {
  onAddClick: () => void;
  onEditClick: (building: Building) => void;
}

export const BuildingTableWidget = ({ onAddClick, onEditClick }: BuildingTableWidgetProps) => {
  const {
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    sortState,
    setSortState,
    remove,
    removeMany,
    seedMockData,
    getFilteredAndSortedItems,
  } = useBuildingStore();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const items = getFilteredAndSortedItems();

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i.id));
    }
  };

  const handleSort = (key: SortKey) => {
    if (!sortState || sortState.key !== key) {
      setSortState({ key, dir: 'asc' });
    } else if (sortState.dir === 'asc') {
      setSortState({ key, dir: 'desc' });
    } else {
      setSortState(null);
    }
  };

  const handleRemoveSelected = () => {
    removeMany(selectedIds);
    setSelectedIds([]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Поиск по адресу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as BuildingType | 'all')}
            className={styles.selectFilter}
          >
            <option value="all">Все типы зданий</option>
            {Object.entries(BUILDING_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.actions}>
          {selectedIds.length > 0 && (
            <button onClick={handleRemoveSelected} className={styles.dangerBtn}>
              Удалить выбранные ({selectedIds.length})
            </button>
          )}

          <button onClick={seedMockData} className={styles.secondaryBtn} title="Заполнить 50 случайными записями">
            ⚡ Заполнить 50 записей
          </button>

          <button onClick={onAddClick} className={styles.primaryBtn}>
            + Добавить здание
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.center} style={{ width: '40px' }}>
                <input
                  type="checkbox"
                  checked={items.length > 0 && selectedIds.length === items.length}
                  onChange={handleSelectAll}
                  className={styles.checkbox}
                />
              </th>
              <th onClick={() => handleSort('address')}>
                Адрес {sortState?.key === 'address' && (sortState.dir === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('type')}>
                Тип {sortState?.key === 'type' && (sortState.dir === 'asc' ? '▲' : '▼')}
              </th>
              <th className={styles.right} onClick={() => handleSort('floors')}>
                Этажи {sortState?.key === 'floors' && (sortState.dir === 'asc' ? '▲' : '▼')}
              </th>
              <th className={styles.right} onClick={() => handleSort('apartments')}>
                Квартиры {sortState?.key === 'apartments' && (sortState.dir === 'asc' ? '▲' : '▼')}
              </th>
              <th className={styles.right} onClick={() => handleSort('serviceLife')}>
                Срок службы {sortState?.key === 'serviceLife' && (sortState.dir === 'asc' ? '▲' : '▼')}
              </th>
              <th className={styles.right} onClick={() => handleSort('yearsToRepair')}>
                До кап. ремонта {sortState?.key === 'yearsToRepair' && (sortState.dir === 'asc' ? '▲' : '▼')}
              </th>
              <th className={styles.center}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.emptyCell}>
                  Список зданий пуст или ничего не найдено по вашему запросу.
                </td>
              </tr>
            ) : (
              items.map((building) => (
                <BuildingRow
                  key={building.id}
                  building={building}
                  isSelected={selectedIds.includes(building.id)}
                  onToggleSelect={handleToggleSelect}
                  onEdit={onEditClick}
                  onDelete={remove}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};