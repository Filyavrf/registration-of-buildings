import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { buildingSchema, type BuildingFormValues } from '@/entities/building/model/schema';
import { BUILDING_TYPE_LABELS } from '@/entities/building/lib/labels';
import type { Building } from '@/entities/building/model/types';
import styles from './BuildingForm.module.scss';

interface BuildingFormProps {
  initialValues?: Building | null; // Если передано, то это режим редактирования
  onSubmit: (data: BuildingFormValues) => void;
  onCancel: () => void;
}

export const BuildingForm = ({ initialValues, onSubmit, onCancel }: BuildingFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BuildingFormValues>({
    resolver: zodResolver(buildingSchema),
    defaultValues: initialValues || {
      type: 'residential',
      floors: 1,
      apartments: 0,
      serviceLife: 30,
      yearsToRepair: 5,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h3 className={styles.title}>
        {initialValues ? 'Редактирование здания' : 'Добавление нового здания'}
      </h3>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Адрес</label>
        <input
          type="text"
          {...register('address')}
          className={styles.input}
          placeholder="Например: ул. Ленина, 10"
        />
        {errors.address && <p className={styles.error}>{errors.address.message}</p>}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Тип здания</label>
        <select {...register('type')} className={styles.select}>
          {Object.entries(BUILDING_TYPE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        {errors.type && <p className={styles.error}>{errors.type.message}</p>}
      </div>

      <div className={styles.rowGroup}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Количество этажей</label>
          <input
            type="number"
            {...register('floors', { valueAsNumber: true })}
            className={styles.input}
          />
          {errors.floors && <p className={styles.error}>{errors.floors.message}</p>}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Количество квартир</label>
          <input
            type="number"
            {...register('apartments', { valueAsNumber: true })}
            className={styles.input}
          />
          {errors.apartments && <p className={styles.error}>{errors.apartments.message}</p>}
        </div>
      </div>

      <div className={styles.rowGroup}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Срок эксплуатации (лет)</label>
          <input
            type="number"
            {...register('serviceLife', { valueAsNumber: true })}
            className={styles.input}
          />
          {errors.serviceLife && <p className={styles.error}>{errors.serviceLife.message}</p>}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Срок до кап. ремонта (лет)</label>
          <input
            type="number"
            {...register('yearsToRepair', { valueAsNumber: true })}
            className={styles.input}
          />
          {errors.yearsToRepair && <p className={styles.error}>{errors.yearsToRepair.message}</p>}
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={onCancel} className={styles.cancelBtn}>
          Отмена
        </button>
        <button type="submit" className={styles.submitBtn}>
          {initialValues ? 'Сохранить изменения' : 'Сохранить в базу'}
        </button>
      </div>
    </form>
  );
};