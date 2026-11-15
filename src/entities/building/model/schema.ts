import { z } from 'zod';

const num = z.number({ error: 'Введите число' });

export const createBuildingSchema = (isAddressTaken: (address: string) => boolean) =>
  z.object({
    address: z
      .string()
      .trim()
      .min(5, 'Адрес должен содержать минимум 5 символов')
      .refine((value) => !isAddressTaken(value), 'Здание с таким адресом уже есть в таблице'),
    type: z.enum(['residential', 'office', 'industrial', 'public']),
    floors: num.int('Только целое число').min(1, 'Минимум 1 этаж').max(200, 'Слишком много этажей'),
    apartments: num.int('Только целое число').min(0, 'Количество квартир не может быть отрицательным'),
    serviceLife: num.min(1, 'Срок службы должен быть больше 0').max(200, 'Максимум 200 лет'),
    yearsToRepair: num.min(0, 'Срок до ремонта не может быть отрицательным'),
  });

export type BuildingFormValues = z.infer<ReturnType<typeof createBuildingSchema>>;