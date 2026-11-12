import type { Building } from '../model/types';
import { BUILDING_TYPE_LABELS } from '../lib/labels';
import styles from './BuildingRow.module.scss';

interface BuildingRowProps {
  building: Building;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onEdit: (building: Building) => void;
  onDelete: (id: string) => void;
}

export const BuildingRow = ({
                              building,
                              isSelected,
                              onToggleSelect,
                              onEdit,
                              onDelete,
                            }: BuildingRowProps) => {
  return (
    <tr className={styles.row}>
      <td className={styles.cellCenter}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(building.id)}
          className={styles.checkbox}
        />
      </td>
      <td className={styles.cellMain}>{building.address}</td>
      <td className={styles.cell}>
        <span className={styles.badge}>
          {BUILDING_TYPE_LABELS[building.type]}
        </span>
      </td>
      <td className={styles.cellRight}>{building.floors}</td>
      <td className={styles.cellRight}>{building.apartments}</td>
      <td className={styles.cellRight}>{building.serviceLife} лет</td>
      <td className={styles.cellRight}>{building.yearsToRepair} лет</td>
      <td className={styles.cellCenter}>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          <button
            onClick={() => onEdit(building)}
            className={styles.editBtn}
          >
            Изменить
          </button>
          <button
            onClick={() => onDelete(building.id)}
            className={styles.deleteBtn}
          >
            Удалить
          </button>
        </div>
      </td>
    </tr>
  );
};