// import Stripe from 'stripe';
// import { InvoiceProps, PaymentProps } from '@/src/lib/types';
// import axios, { AxiosError } from 'axios';
// import { getToken } from 'sf-jwt-token';

// /*
// overview of API field names and what they reference
// Opportunity_18_Digit_ID__c: 18 character unique ID
//  npe01__Opportunity__c: references opportunity by name from the payment record
// ID: unique reference id for the object
// Invoice_Sent_Date__c: date sent
// Invoice__c: Invoice number
// Opportunity_Account_Name__c: account name of the opportunity (project) the payment is for
// npe01__Payment_Amount__c: amount on invoice
// npe01__Payment_Date__c: date invoice paid
// npe01__Payment_Method__c: method of payment (cc, check, etc.)
// */
// const {
//   SALESFORCE_CLIENT_ID,
//   SALESFORCE_USERNAME,
//   SALESFORCE_URL,
//   BASE64_PRIVATE_KEY,
//   STRIPE_SECRET_KEY,
//   SALESFORCE_GRAPHQL_URI,
//   SALESFORCE_COOKIE_AUTH,
// } = process.env;
// const data = JSON.stringify({
//   query: `query payments {
//   uiapi {
//     query {
//       npe01__OppPayment__c {
//         edges {
//           node {
//             Id
//             Invoice__c {
//                 value
//             }
//             Invoice_Sent_Date__c {
//                 value
//             }
//             npe01__Payment_Amount__c {
//                 value
//             }
//             Opportunity_Account_Name__c {
//                 value
//             }
//             Opportunity_18_Digit_ID__c {
//                 value
//             }
//             Project_Number__c {
//               value
//               }
//             npe01__Payment_Method__c {
//                 value
//             }
//             npe01__Payment_Date__c {
//                 value
//             }
//             npe01__Scheduled_Date__c{
// 							value
// 						}
//           }
//         }
//       }
//     }
//   }
// }`,
//   variables: {},
// });

// export const getStripeInvoiceData = async (invoiceId: string) => {
//   const stripe = new Stripe(STRIPE_SECRET_KEY, {
//     apiVersion: '2023-08-16',
//     typescript: true,
//   });
//   try {
//     const invoice = await stripe.invoices.retrieve(invoiceId);
//     return invoice;
//   } catch (err) {
//     if (err instanceof Stripe.errors.StripeError) {
//       if (err.type === 'StripeInvalidRequestError') {
//         return err;
//       }
//     }
//   }
// };

// export const getSalesForceInvoiceData = async (accessToken: string) => {
//   try {
//     const res = await axios.request({
//       method: 'post',
//       maxBodyLength: Infinity,
//       url: SALESFORCE_GRAPHQL_URI,
//       headers: {
//         'X-Chatter-Entity-Encoding': 'false',
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${accessToken}`,
//         Cookie: SALESFORCE_COOKIE_AUTH,
//       },
//       data: data,
//     });

//     // retrieve all invoice information from salesforce graphql call
//     const paymentInfo = res.data.data.uiapi.query.npe01__OppPayment__c.edges;

//     const invoices = paymentInfo.map((record: InvoiceProps) => {
//       const {
//         Id,
//         Invoice__c,
//         Invoice_Sent_Date__c,
//         npe01__Payment_Amount__c,
//         Opportunity_Account_Name__c,
//         Project_Number__c,
//         npe01__Payment_Method__c,
//         npe01__Payment_Date__c,
//         npe01__Scheduled_Date__c,
//       } = record.node;

//       const invoice = {
//         sf_unique_id: Id,
//         invoice_id: Invoice__c.value,
//         amount: npe01__Payment_Amount__c.value,
//         invoice_sent_date: Invoice_Sent_Date__c.value,
//         payment_date: npe01__Payment_Date__c.value,
//         invoice_due_date: npe01__Scheduled_Date__c.value,
//         payment_method: npe01__Payment_Method__c.value,
//         project_name: Project_Number__c.value,
//         account_name: Opportunity_Account_Name__c.value,
//       };

//       return invoice;
//     });

//     return invoices;
//   } catch (error) {
//     if (error instanceof AxiosError) {
//       console.log(error);
//       return error.message;
//     }
//     return error;
//   }
// };

// export const getSalesForceAccessToken = async () => {
//   // convert the base64 private key into a string
//   const privateKey = Buffer.from(BASE64_PRIVATE_KEY, 'base64').toString('utf8');

//   try {
//     // gets a new (if it hasn't expired it will send the still active token) access token from sales force
//     const jwtTokenResponse = await getToken({
//       iss: SALESFORCE_CLIENT_ID as string,
//       sub: SALESFORCE_USERNAME as string,
//       aud: SALESFORCE_URL as string,
//       privateKey: privateKey,
//     });

//     return jwtTokenResponse.access_token;
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error('Error fetching Salesforce access token:', {
//         name: error.name,
//         message: error.message,
//         stack: error.stack,
//       });
//     }
//     throw Error;
//   }
// };
