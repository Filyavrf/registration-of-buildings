import { z } from 'zod';

const num = z.number({ error: 'Введите число' });

export const createBuildingSchema = (isAddressTaken: (address: string) => boolean) =>
  z.object({
      address: z
        .string()
        .trim()
        .min(3, 'Адрес должен содержать минимум 3 символа')
        .max(100, 'Адрес не должен быть длиннее 100 символов')
        .refine((value) => !isAddressTaken(value), 'Здание с таким адресом уже есть в таблице'),
      type: z.enum(['residential', 'office', 'industrial', 'public']),
      floors: num
        .int('Только целое число')
        .min(1, 'Минимум 1 этаж')
        .max(200, 'Максимум 200 этажей'),
      apartments: num
        .int('Только целое число')
        .min(0, 'Количество квартир не может быть отрицательным')
        .max(5000, 'Максимум 5000 квартир'),
      serviceLife: num
        .int('Только целое число')
        .min(1, 'Срок эксплуатации должен быть не меньше 1 года')
        .max(500, 'Максимум 500 лет'),
      yearsToRepair: num
        .int('Только целое число')
        .min(0, 'Срок до ремонта не может быть отрицательным')
        .max(100, 'Максимум 100 лет'),
  });

export type BuildingFormValues = z.infer<ReturnType<typeof createBuildingSchema>>;