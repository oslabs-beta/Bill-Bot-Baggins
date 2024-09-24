import { z } from 'zod';

const InvoiceRecordSchema = z.object({
  Id: z.string(),
  Invoice__c: z.object({
    value: z.string(),
  }),
  npe01__Payment_Amount__c: z.object({
    value: z.number(),
  }),
  Invoice_Sent_Date__c: z.object({
    value: z.string(),
  }),
  npe01__Payment_Date__c: z.object({
    value: z.string(),
  }),
  npe01__Scheduled_Date__c: z.object({
    value: z.string(),
  }),
  npe01__Payment_Method__c: z.object({
    value: z.string(),
  }),
  Project_Number__c: z.object({
    value: z.string(),
  }),
  Opportunity_Account_Name__c: z.object({
    value: z.string(),
  }),
});

export const PaymentInfoSchema = z.object({
  data: z.object({
    uiapi: z.object({
      query: z.object({
        npe01__OppPayment__c: z.object({
          edges: z.array(
            z.object({
              node: InvoiceRecordSchema,
            })
          ),
        }),
      }),
    }),
  }),
});
