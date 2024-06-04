const { salesforceRouter } = require("./routers/salesforceRouter.js");
const { stripeRouter } = require("./routers/stripeRouter.js");

const { retreiveOppType, updateSalesforceStripeId, getPaymentType } =
  salesforceRouter;

const { createStripeInvoice, payStripeInvoice, voidStripeInvoice } =
  stripeRouter;

const recordTypes = [
  "SP",
  "BD",
  "FD",
  "LC",
  "RF",
  "OD",
  "FOC",
  "OA",
  "CA",
  "HR",
  "Customized",
  "SM",
  "CC",
  "EDLI",
  "DDP",
];

const eventHandler = async (event) => {
  let opportunity;
  let paymentType = {};
  const { changeType, recordIds, changedFields } =
    event.payload.ChangeEventHeader;
  const { For_Chart__c, npe01__Payment_Amount__c, Name } = event.payload;
  const recordId = recordIds[0];

  if (changedFields.length === 1) return;

  switch (changeType) {
    case "CREATE": {
      console.log("CREATE case changeType: ", changeType);
      // initialize variable to payment record ID
      paymentType = For_Chart__c;
      // assign opp variable to the evaluated result of retrieveOppType function passing in recordId
      if (paymentType == "Cost to Client")
        opportunity = await retreiveOppType(recordId);
      else {
        console.log(
          "This event does not meet the requirements for creating a stripe invoice",
        );
        break;
      }

      if (recordTypes.includes(opportunity.type)) {
        const paymentAmount = npe01__Payment_Amount__c;
        const invoice_number = Name;
        console.log("payment amount: ", paymentAmount);

        const paymentDetails = {
          account_name: opportunity.account_name,
          amount: paymentAmount,
          project_type: opportunity.project_type,
          invoice_number: invoice_number.string,
          recordId: recordId,
        };
        //create invoice in stripe
        const stripeInvoice = await createStripeInvoice(paymentDetails);

        //update salesforce record with stripe invoice id
        await updateSalesforceStripeId(recordId, stripeInvoice.id);
      }
      break;
    }

    case "UPDATE": {
      console.log("UPDATE case changeType: ", changeType);

      if (!For_Chart__c) {
        const clientPayment = getPaymentType(recordId);
        if (clientPayment) paymentType = "Cost to Client";
      }
      // console.log("UPDATE payment type: ", paymentType);
      const updates = {};
      changedFields.forEach((field) => {
        console.log("UPDATE change fields: ", changedFields);
        updates[field] = event.payload[field];
      });
      console.log("UPDATE updates object: ", updates);
      const { npe01__Paid__c, npe01__Written_Off__c, OutsideFundingSource__c } =
        updates;

      if (OutsideFundingSource__c) {
        console.log("OUTSIDE FUNDING SOURCE");
      }
      if (npe01__Written_Off__c) {
        console.log("MARK STRIPE INVOICE VOID");
        const written_off = npe01__Written_Off__c;
        written_off.boolean === true
          ? voidStripeInvoice(recordId)
          : console.log("invoice not marked void");
      }
      if (npe01__Paid__c) {
        const payobject = npe01__Paid__c;
        payobject.boolean === true
          ? payStripeInvoice(recordId)
          : console.log("invoice not marked paid");
      }
      break;
    }
    case "DELETE": {
      //need to store salesforce and stripe ids so that when /if a payment is deleted, it can get voided/deleted in stripe
      console.log("DELETE case");
      break;
    }
    default: {
      console.log("default case hit: ", JSON.stringify(event, null, 2));
      break;
    }
  }
};

module.exports = eventHandler;
