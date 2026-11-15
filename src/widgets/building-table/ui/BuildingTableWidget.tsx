import { useState } from 'react';
import { useBuildingStore } from '@/entities/building/model/store.ts';
import { BuildingRow } from '@/entities/building/ui/BuildingRow.tsx';
import { BUILDING_TYPE_LABELS } from '@/entities/building/lib/labels.ts';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog/ConfirmDialog.tsx';
import type { Building, BuildingType, SortKey } from '@/entities/building/model/types.ts';
import styles from './BuildingTableWidget.module.scss';

interface BuildingTableWidgetProps {
  onAddClick: () => void;
  onEditClick: (building: Building) => void;
}

interface PendingDelete {
  ids: string[];
  message: string;
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
    getFilteredAndSortedItems,
  } = useBuildingStore();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const items = getFilteredAndSortedItems();

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setSelectedIds([]);
  };

  const handleFilterChange = (value: BuildingType | 'all') => {
    setFilterType(value);
    setSelectedIds([]);
  };

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

  const requestDeleteOne = (id: string) => {
    const building = items.find((b) => b.id === id);
    setPendingDelete({
      ids: [id],
      message: `Удалить здание «${building?.address ?? ''}»?`,
    });
  };

  const requestDeleteSelected = () => {
    setPendingDelete({
      ids: selectedIds,
      message: `Удалить выбранные здания (${selectedIds.length})?`,
    });
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const { ids } = pendingDelete;

    if (ids.length === 1) {
      remove(ids[0]);
    } else {
      removeMany(ids);
    }

    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
    setPendingDelete(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Поиск по адресу..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className={styles.searchInput}
          />

          <select
            value={filterType}
            onChange={(e) => handleFilterChange(e.target.value as BuildingType | 'all')}
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
            <button onClick={requestDeleteSelected} className={styles.dangerBtn}>
              Удалить выбранные ({selectedIds.length})
            </button>
          )}

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
                  onDelete={requestDeleteOne}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={pendingDelete !== null}
        message={pendingDelete?.message ?? ''}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};