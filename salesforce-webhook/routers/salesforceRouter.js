const axios = require("axios");
const { getSalesForceAccessToken } = require("./authRouter.js");

const salesforceRouter = {};

/**
 * @description retrieves the stripe invoice id corresponding to the salesforce transaction
 * @param {string} recordId - gets salesforce id corresponding to the record id
 * @returns
 */
salesforceRouter.getStripeId = async (recordId) => {
  const access_token = await getSalesForceAccessToken();
  const data = JSON.stringify({
    query: `query payments ($Id: ID) {
			uiapi {
				query {
					npe01__OppPayment__c (where: { Id: { eq: $Id } }) {
						edges {
							node {
								Stripe_Invoice_ID__c {
									value
								}
							}
						}
					}
				}
			}
	}`,
    variables: { Id: recordId },
  });

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: process.env.SALESFORCE_GRAPHQL_URI,
    headers: {
      "X-Chatter-Entity-Encoding": "false",
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
      Cookie: process.env.SALESFORCE_COOKIE_AUTH,
    },
    data: data,
  };
  const fetchStripeId = await axios.request(config);
  const stripeId =
    fetchStripeId.data.data.uiapi.query.npe01__OppPayment__c.edges[0].node
      .Stripe_Invoice_ID__c.value;
  return stripeId;
};

/**
 * @description retrieves payment type from salesforce api
 * @param {string} id - payment record id from salesforce data change capture event
 * @returns
 */
salesforceRouter.getPaymentType = async (id) => {
  const access_token = await getSalesForceAccessToken();
  let clientPayment = false;
  const data = JSON.stringify({
    query: `query payments ($Id: ID) {
		uiapi {
			query {
				npe01__OppPayment__c (where: { Id: { eq: $Id } }) {
					edges {
						node {
							For_Chart__c {
									value
							}
						}
					}
				}
			}
		}
	}`,
    variables: { Id: id },
  });
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: process.env.SALESFORCE_GRAPHQL_URI,
    headers: {
      "X-Chatter-Entity-Encoding": "false",
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
      Cookie: process.env.SALESFORCE_COOKIE_AUTH,
    },
    data: data,
  };

  const fetchPaymentType = await axios.request(config);
  const paymentType =
    fetchPaymentType.data.data.uiapi.query.npe01__OppPayment__c.edges[0].node
      .For_Chart__c.value;
  if (paymentType === "Cost to Client") clientPayment = true;
  return clientPayment;
};

/**
 * @description helper function - graphQL api call to salesforce for opportunity record ID
 * @param { id } string - payment record id from data change capture event
 * @return { string } - salesforce opportunity id
 */
salesforceRouter.getOppRecordId = async (id) => {
  const access_token = await getSalesForceAccessToken();
  const data = JSON.stringify({
    query: `query payments ($Id: ID) {
		uiapi {
			query {
				npe01__OppPayment__c (where: { Id: { eq: $Id } }) {
					edges {
						node {
							Id
							Opportunity_Account_Name__c {
									value
							}
							npe01__Opportunity__c {
									value
							}
						}
					}
				}
			}
		}
	}`,
    variables: { Id: id },
  });
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: process.env.SALESFORCE_GRAPHQL_URI,
    headers: {
      "X-Chatter-Entity-Encoding": "false",
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
      Cookie: process.env.SALESFORCE_COOKIE_AUTH,
    },
    data: data,
  };

  const fetchOppId = await axios.request(config);
  const oppId =
    fetchOppId.data.data.uiapi.query.npe01__OppPayment__c.edges[0].node
      .npe01__Opportunity__c.value;

  return oppId;
};

/**
 * @description graphQL salesforce API call to retrive opportunity record type for payment record captured in data change event
 * @param {string} id - payment record id from salesforce data change capture event
 * @returns { object }  opportunty type abbreviation, type - long form, and account name properties
 */

salesforceRouter.retreiveOppType = async (id) => {
  const access_token = await getSalesForceAccessToken();
  const fetchOppId = await salesforceRouter.getOppRecordId(id);

  const data = JSON.stringify({
    query: `query payments ($Id: ID) {
		uiapi {
			query {
				Opportunity (where: { Id: { eq: $Id } }) {
					edges {
						node {
							Id
							Name {
									value
							}
							Type {
									value
							}
							FOR_CONGA_Engagement_Type__c {
                value
            }
						Account {
							Name {
									value
							}
					}
						}
					}
				}
			}
		}
	}`,
    variables: { Id: fetchOppId },
  });
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: process.env.SALESFORCE_GRAPHQL_URI,
    headers: {
      "X-Chatter-Entity-Encoding": "false",
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
      Cookie: process.env.SALESFORCE_COOKIE_AUTH,
    },
    data: data,
  };
  const fetchOppType = await axios.request(config);
  const {
    Id,
    Type,
    npsp__Primary_Contact__c,
    FOR_CONGA_Engagement_Type__c,
    Account,
  } = fetchOppType.data.data.uiapi.query.Opportunity.edges[0].node;
  const opportunity = {
    type: Type.value,
    project_type: FOR_CONGA_Engagement_Type__c.value,
    // primary_contact_id: npsp__Primary_Contact__c.value,
    account_name: Account.Name.value,
    sf_opp_id: Id,
  };
  return opportunity;
};

/**
 * @description updates the salesforce transaction of the recordId with the new stripeInvoiceId
 * @param {string} recordId - payment record id from salesforce data change capture event
 * @param {string} stripeInvoiceId - stripe invoice id corresponding the salesforce transaction
 * @returns
 */
salesforceRouter.updateSalesforceStripeId = async (
  recordId,
  stripeInvoiceId,
) => {
  const access_token = await getSalesForceAccessToken();
  const data = JSON.stringify({
    allowSaveOnDuplicate: false,
    fields: {
      Stripe_Invoice_ID__c: stripeInvoiceId,
    },
  });

  const config = {
    method: "patch",
    maxBodyLength: Infinity,
    url: `${process.env.SALESFORCE_API_URI}/${recordId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
      Cookie: process.env.SALESFORCE_COOKIE_AUTH,
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      // console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });

  return;
};

exports.salesforceRouter = salesforceRouter;
