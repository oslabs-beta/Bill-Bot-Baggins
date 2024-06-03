import { z } from 'zod';

export const InvoiceInfoSchema = z.object({
  sf_unique_id: z.string(),
  invoice_id: z.string(),
  amount: z.number(),
  invoice_sent_date: z.string(),
});
