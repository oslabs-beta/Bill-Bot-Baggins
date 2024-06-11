const { salesforceRouter } = require("./routers/salesforceRouter.js");
const { stripeRouter } = require("./routers/stripeRouter.js");

const { retreiveOppType, updateSalesforceStripeId, getPaymentType } =
  salesforceRouter;

const {
  createStripeInvoice,
  payStripeInvoice,
  voidStripeInvoice,
  deleteDBEntry,
} = stripeRouter;

// record types for different transactions within salesforce for ESC bookkeeping
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

/**
 * eventHandler handles streamed events from the salesforce webhook, and makes corresponding CREATE, UPDATE, and DELETE changes in the stripe webhooks
 * @param {object} event - the streamed event from the stripe router grpc webhook
 */
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

        const paymentDetails = {
          account_name: opportunity.account_name,
          amount: paymentAmount,
          project_type: opportunity.project_type,
          invoice_number: invoice_number,
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
      if (!For_Chart__c) {
        const clientPayment = getPaymentType(recordId);
        if (clientPayment) paymentType = "Cost to Client";
      }
      // map changed fields from salesforce payload to updates object
      const updates = {};
      changedFields.forEach((field) => {
        updates[field] = event.payload[field];
      });
      const { npe01__Paid__c, npe01__Written_Off__c, OutsideFundingSource__c } =
        updates;

      console.log(
        "these are the updates coming in, check to see what paid__c is",
        updates,
      );
      //iterate through and update stripe invoice accordingly

      if (OutsideFundingSource__c) {
      }
      if (npe01__Written_Off__c) {
        const written_off = npe01__Written_Off__c;
        written_off.boolean === true
          ? voidStripeInvoice(recordId)
          : console.log("invoice not marked void");
      }
      if (npe01__Paid__c) {
        npe01__Paid__c === true
          ? payStripeInvoice(recordId)
          : console.log("invoice not marked paid");
      }

      // if payment amount has changed in salesforce, finalized stripe invoices cannot be edited, but only created and deleted.
      if (npe01__Payment_Amount__c) {
        ("update payment hit");
        stripeRouter.updatePaymentAmount(
          recordId,
          npe01__Payment_Amount__c,
          Name,
        );
      }
      break;
    }

    case "DELETE": {
      deleteDBEntry(event.payload.ChangeEventHeader.recordIds[0]);
      break;
    }
    default: {
      console.log("default case hit: ", JSON.stringify(event, null, 2));
      break;
    }
  }
};

module.exports = eventHandler;
