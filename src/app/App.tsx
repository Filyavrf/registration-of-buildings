import { useState } from 'react';
import './normalize.scss';
import styles from './App.module.scss';
import { BuildingTableWidget } from '../widgets/building-table/ui/BuildingTableWidget.tsx';
import { BuildingForm } from '../features/building-form/ui/BuildingForm.tsx';
import { useBuildingStore } from '../entities/building/model/store.ts';
import type { BuildingFormValues } from '../entities/building/model/schema.ts';
import type { Building } from '../entities/building/model/types.ts';

function App() {
  const [formMode, setFormMode] = useState<'closed' | 'create' | Building>('closed');

  const addBuilding = useBuildingStore((state) => state.add);
  const updateBuilding = useBuildingStore((state) => state.update);

  const handleFormSubmit = (data: BuildingFormValues) => {
    if (formMode === 'create') {
      addBuilding(data);
    } else if (typeof formMode === 'object' && formMode !== null) {
      updateBuilding(formMode.id, data);
    }
    setFormMode('closed');
  };

  return (
    <main className={styles.mainContainer}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Учет зданий</h1>
            <p className={styles.subtitle}>
              Курсовая работа
            </p>
          </div>
        </header>

        {formMode !== 'closed' ? (
          <BuildingForm
            initialValues={typeof formMode === 'object' ? formMode : null}
            onSubmit={handleFormSubmit}
            onCancel={() => setFormMode('closed')}
          />
        ) : (
          <BuildingTableWidget
            onAddClick={() => setFormMode('create')}
            onEditClick={(building) => setFormMode(building)}
          />
        )}
      </div>
    </main>
  );
}

export default App;