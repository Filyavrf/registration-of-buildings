import { z } from 'zod';

export const buildingSchema = z.object({
  address: z.string().min(3,"Адрес должен содержать минимум 3 символа"),
  type: z.enum(['residential','office','industrial','public']),
  floors: z.number().min(1,"Минимум 1 этаж").max(200,"Слишком много этажей"),
  apartments: z.number().min(0, 'Количество квартир не может быть отрицательным'),
  serviceLife: z.number().min(1, 'Срок службы должен быть больше 0'),
  yearsToRepair: z.number().min(0, 'Срок до ремонта не может быть отрицательным'),
})

export type BuildingFormValues = z.infer<typeof buildingSchema>;