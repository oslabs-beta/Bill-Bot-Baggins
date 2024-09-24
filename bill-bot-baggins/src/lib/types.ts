export type PaymentProps = {
	sf_unique_id: string;
	account_name?: string;
	project_name?: string;
	payment_method?: string;
	invoice_sent_date?: string;
	invoice_due_date?: string;//due 14 days from invoice date
	payment_date?: string; //invoice_paid_date
	amount: number;
	invoice_id: string;
}

export type InvoiceId = {
	invoiceId: string
}

export type Token = {
	token: string;
  };

export  type InvoiceProps = {
	node: {
	  Id: string,
	  Invoice__c: {
		value: string
	  },
	  Project_Number__c: {
		value: string | undefined
	  }
	  Invoice_Sent_Date__c: {
		value: string | undefined
	  },
	  npe01__Payment_Amount__c: {
		value: number
	  },
	  Opportunity_Account_Name__c: {
		value: string
	  },
	  npe01__Payment_Method__c: {
		value: string
	  },
	  npe01__Payment_Date__c: {
		value: string | undefined
	  },
	  npe01__Scheduled_Date__c: {
		value: string | undefined
	  }
	}
}
