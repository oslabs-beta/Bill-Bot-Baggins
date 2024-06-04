const Stripe = require("stripe");
const { salesforceRouter } = require("./salesforceRouter.js");

const { getStripeId } = salesforceRouter;

const config = {
  apiVersion: "2023-08-16",
  typescript: true,
};
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, config);

const stripeRouter = {};
/**
 * @typedef {Object} PaymentDetails
 * @property {string} account_name - The name of the account.
 * @property {number} amount - The payment amount.
 * @property {string} project_type - The type of the project.
 * @property {string} invoice_number - The invoice number.
 * @property {string} recordId - The record ID.
 */

/**
 * creates invoice in Stripe to match payment record received from salesforce
 * @param {PaymentDetails } paymentDetails - data needed to create stripe invoice
 * @return stripe invoice ID
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
    console.log("payment deets.account_name ", paymentInfo.account_name);
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
  });

  console.log("new stripe invoice created in webhook route: ", newInvoice);
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

  /**
   * retrieve final invoice from stripe
   * */
  const finalInvoice = await stripe.invoices.finalizeInvoice(newInvoice.id);
  return finalInvoice;
};

/** look up invoice in stripe to see if exists */

/**update invoice in stripe */
stripeRouter.payStripeInvoice = async (recordId, stripeInvoiceDetails) => {
  try {
    const stripeInvoiceId = await getStripeId(recordId);
    if (await stripe.invoices.retrieve(stripeInvoiceId)) {
      const updatedInvoice = await stripe.invoices.pay(stripeInvoiceId, {
        paid_out_of_band: true,
      });
      return updatedInvoice;
    }
  } catch (error) {
    console.log(error);
  }
};

stripeRouter.voidStripeInvoice = async (recordId) => {
  try {
    const stripeInvoiceId = await getStripeId(recordId);
    if (await stripe.invoices.retrieve(stripeInvoiceId)) {
      const updatedInvoice = await stripe.invoices.voidInvoice(stripeInvoiceId);
      return updatedInvoice;
    }
  } catch (error) {
    console.log(error);
  }
};

//in stripe finalized invoices cannot have their amounts updated, they can only be voided and recreated
stripeRouter.updatePaymentAmount = async (
  recordId,
  newPaymentAmount,
  invoice_number,
) => {
  // retrieve invoice id from stripe using salesforce record id
  const stripeInvoiceId = await getStripeId(recordId);
  const invoice = await stripe.invoices.retrieve(stripeInvoiceId);

  console.log("invoice: ", invoice);

  //destructure all relevant paramters from previous stripe invoice
  const { customer: customer } = invoice;

  //void stripe invoice
  stripe.invoices.voidInvoice(stripeInvoiceId);

  //create new invoice in stripe with updated amount
  const newInvoice = await stripe.invoices.create({
    customer: customer,
    auto_advance: false,
    collection_method: "send_invoice",
    days_until_due: 30,
  });

  console.log(newInvoice, "new invoice created");
  // where is paymentInfor coming from?
  //opportunity is coming form retrieve opp records
  const opportunity = await salesforceRouter.retreiveOppType(recordId);

  console.log("this is the opportunity", opportunity);

  // where is invoice number coming from
  //it comes from name from the salesforce record but since
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

  console.log("this is the product:", product);

  /**
   * add line item to invoice just created
   */
  await stripe.invoiceItems.create({
    customer: customer,
    price: product.default_price,
    invoice: newInvoice.id,
  });

  /**
   * retrieve final invoice from stripe
   * */
  const finalInvoice = await stripe.invoices.finalizeInvoice(newInvoice.id);
  //link previous salesforce record to new stripe invoice id
  await salesforceRouter.updateSalesforceStripeId(recordId, finalInvoice.id);

  // return finalInvoice
  return finalInvoice;
};

exports.stripeRouter = stripeRouter;
