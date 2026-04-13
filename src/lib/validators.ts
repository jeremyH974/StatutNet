import { z } from 'zod';

export const simulationSchema = z.object({
  chiffreAffaires: z.number().min(0, 'Le CA doit être positif').max(10_000_000, 'CA trop élevé'),
  activityType: z.enum(['BNC', 'BIC_SERVICES', 'BIC_VENTE']),
  partsFiscales: z.number().min(1, 'Minimum 1 part').max(10, 'Maximum 10 parts').step(0.5),
  chargesReelles: z.number().min(0, 'Les charges doivent être positives'),
  withACRE: z.boolean(),
  withVersementLiberatoire: z.boolean(),
  remunerationPctEURL: z.number().min(0).max(100),
  remunerationPctSASU: z.number().min(0).max(100),
});

export type SimulationFormData = z.infer<typeof simulationSchema>;
