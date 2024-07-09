const Stripe = require("stripe");
const { salesforceRouter } = require("./salesforceRouter.js");
const { ServerDescription } = require("mongodb");
const dbCollection = import("../server.mjs");
const { getStripeId } = salesforceRouter;

const config = {
  apiVersion: "2023-08-16",
  typescript: true,
};
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, config);

const stripeRouter = {};

/**
 * @description creates invoice in Stripe to match payment record received from salesforce
 * @param {object} Paymentdetails - data needed to create stripe invoice
 * @return {object} returns the finalized stripe invoice object
 */
stripeRouter.createStripeInvoice = async (paymentInfo) => {
  /**
   * retrieve customer list from stripe
   */
  const customerList = await stripe.customers.list();
  let customerId;
  customerList.data.forEach((element) => {
    if (element.name === paymentInfo.account_name) {
      customerId = element.id;
      return;
    }
  });

  /**
   * if account is not in stripe yet, create account and retrieve the customer id to send the invoice to
   * all invoices will be created with an ESCSC.org billing email for now - wil not send emails to clients from Stripe
   */
  if (!customerId) {
    // Create a new Customer
    const customer = await stripe.customers.create({
      name: paymentInfo.account_name,
      email: "lcharity@escsc.org",
    });

    customerId = customer.id;
  }

  /**
   * create new invoice in stripe based on invoice information from salesforce (on paymentInfo arg)
   */
  const newInvoice = await stripe.invoices.create({
    customer: customerId,
    auto_advance: false,
    collection_method: "send_invoice",
    days_until_due: 30,
    metadata: { salesforce_id: paymentInfo.recordId },
  });

  /**
   * need product type from salesforce (passed in on arg object) to create the "product type" and then assign a default price (also on passed in object)
   */
  const product = await stripe.products.create({
    name: `${paymentInfo.project_type} Project Invoice #: ${paymentInfo.invoice_number} `,
    default_price_data: {
      currency: "usd",
      unit_amount: paymentInfo.amount * 100,
    },
  });

  /**
   * add line item to invoice just created
   */
  await stripe.invoiceItems.create({
    customer: customerId,
    price: product.default_price,
    invoice: newInvoice.id,
  });

  const finalInvoice = await stripe.invoices.finalizeInvoice(newInvoice.id);
  return finalInvoice;
};

/**
 * @description this updates the adjoining stripe invoice to
 * @param {string} recordId
 * @returns the paidInvoice
 */
stripeRouter.payStripeInvoice = async (recordId) => {
  try {
    const stripeInvoiceId = await getStripeId(recordId);
    if (await stripe.invoices.retrieve(stripeInvoiceId)) {
      const paidInvoice = await stripe.invoices.pay(stripeInvoiceId, {
        paid_out_of_band: true,
      });
      return paidInvoice;
    }
  } catch (error) {
    console.log(`Error occurredin payStripeInvoice: ${error}`);
  }
};

/**
 * voids invoice within stripe
 * @param {string} recordId - id for document with salesforce
 * @returns
 */
stripeRouter.voidStripeInvoice = async (recordId) => {
  try {
    const stripeInvoiceId = await getStripeId(recordId);
    if (await stripe.invoices.retrieve(stripeInvoiceId)) {
      const voidedInvoice = await stripe.invoices.voidInvoice(stripeInvoiceId);
      return voidedInvoice;
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * @description
 * - since in stripe invoices can only be voided and created, this:
 * - voids the previous stripe invoice
 * - creates a new stripe invoice
 * - updates the salesforce transaction with the new stripe invoice id
 * - updates corresponding database entry with the updated info
 * @param {string} recordId - the salesforceId
 * @param {number} newPaymentAmount - what the payment amount in the salesforce & stripe accounts should be set to
 * @param {string} invoice_number - the stripe invoice number from the salesforce account used to create and name the new stripe product
 * @returns
 */
//in stripe finalized invoices cannot have their amounts updated, they can only be voided and recreated
stripeRouter.updatePaymentAmount = async (
  recordId,
  newPaymentAmount,
  invoice_number,
) => {
  // retrieve invoice id from stripe using salesforce record id
  const stripeInvoiceId = await getStripeId(recordId);
  const invoice = await stripe.invoices.retrieve(stripeInvoiceId);

  //destructure all relevant parameters from previous stripe invoice
  const { customer: customer } = invoice;

  //void stripe invoice
  stripe.invoices.voidInvoice(stripeInvoiceId);

  //create new invoice in stripe with updated amount
  const newInvoice = await stripe.invoices.create({
    customer: customer,
    auto_advance: false,
    collection_method: "send_invoice",
    days_until_due: 30,
    metadata: { salesforce_id: recordId },
  });

  const opportunity = await salesforceRouter.retreiveOppType(recordId);

  /**
   * need product type from salesforce (passed in on arg object) to create the "product type" and then assign a default price (also on passed in object)
   */
  const product = await stripe.products.create({
    name: `${opportunity.project_type} Project Invoice #: ${invoice_number} `,
    default_price_data: {
      currency: "usd",
      unit_amount: newPaymentAmount * 100,
    },
  });

  /**
   * add line item to invoice just created
   */
  await stripe.invoiceItems.create({
    customer: customer,
    price: product.default_price,
    invoice: newInvoice.id,
  });

  // retrieve final invoice from stripe
  const finalInvoice = await stripe.invoices.finalizeInvoice(newInvoice.id);
  //link previous salesforce record to new stripe invoice id
  await salesforceRouter.updateSalesforceStripeId(recordId, finalInvoice.id);

  // return finalInvoice
  return finalInvoice;
};

/**
 * @description deletes the stripe id associated with the salesforce recordId within stripe
 * @param {string} salesforceID - of the deleted node
 * @returns
 **/
stripeRouter.deleteStripeInvoice = async (salesforceID) => {
  try {
    const invoices = await stripe.invoices.list({
      limit: 10,
    });

    const invoice = invoices.data.filter((invoice) => {
      return invoice.metadata.salesforce_id === salesforceID;
    });

    const stripeId = invoice[0].id;

    // void stripe invoice
    const updatedInvoice = await stripe.invoices.voidInvoice(stripeId);
    if (updatedInvoice)
      console.log(`successfully canceled invoice ${stripeId} in stripe`);

    return;
  } catch (error) {
    console.log(`Error occurred in stripeRouter.deleteDBEntry: ${error}`);
  }
};

exports.stripeRouter = stripeRouter;
