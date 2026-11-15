import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBuildingSchema, type BuildingFormValues } from '@/entities/building/model/schema.ts';
import { useBuildingStore } from '@/entities/building/model/store.ts';
import { isAddressTaken } from '@/entities/building/lib/address.ts';
import { BUILDING_TYPE_LABELS } from '@/entities/building/lib/labels.ts';
import type { Building } from '@/entities/building/model/types.ts';
import styles from './BuildingForm.module.scss';

const DEFAULT_VALUES: BuildingFormValues = {
  address: '',
  type: 'residential',
  floors: 1,
  apartments: 0,
  serviceLife: 30,
  yearsToRepair: 5,
};

interface BuildingFormProps {
  initialValues?: Building | null;
  onSubmit: (data: BuildingFormValues) => void;
  onSubmitAndContinue?: (data: BuildingFormValues) => void;
  onCancel: () => void;
}

export const BuildingForm = ({
                               initialValues,
                               onSubmit,
                               onSubmitAndContinue,
                               onCancel,
                             }: BuildingFormProps) => {
  const items = useBuildingStore((state) => state.items);

  const schema = useMemo(
    () =>
      createBuildingSchema((address) =>
        isAddressTaken(items, address, initialValues?.id)
      ),
    [items, initialValues?.id]
  );

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<BuildingFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues || DEFAULT_VALUES,
    mode: 'onBlur',
  });

  const [addedCount, setAddedCount] = useState(0);

  const handleSaveAndContinue = handleSubmit((data) => {
    onSubmitAndContinue?.(data);
    setAddedCount((count) => count + 1);
    reset(DEFAULT_VALUES);
    setFocus('address');
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h3 className={styles.title}>
        {initialValues ? 'Редактирование здания' : 'Добавление нового здания'}
      </h3>

      {addedCount > 0 && (
        <p className={styles.counter}>Добавлено в этой сессии: {addedCount}</p>
      )}

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
          {addedCount > 0 ? 'Готово' : 'Отмена'}
        </button>

        {!initialValues && onSubmitAndContinue && (
          <button type="button" onClick={handleSaveAndContinue} className={styles.secondaryBtn}>
            Сохранить и добавить ещё
          </button>
        )}

        <button type="submit" className={styles.submitBtn}>
          {initialValues ? 'Сохранить изменения' : 'Сохранить в базу'}
        </button>
      </div>
    </form>
  );
};