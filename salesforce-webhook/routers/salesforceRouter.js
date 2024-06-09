const axios = require("axios");
const { getSalesForceAccessToken } = require("./authRouter.js");

const salesforceRouter = {};

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
 * helper function - graphQL api call to salesforce for opportunity record ID
 * @param string - payment record id from data change capture event
 * @return string - opportunity record id
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
 * graphQL salesforce API call to retrive opportunity record type for payment record captured in data change event
 * @param {*} id
 * @returns object with opportunty type abbreviation, type - long form, and account name properties
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

salesforceRouter.updateSalesforceStripeId = async (
  recordId,
  stripeinvoiceId,
) => {
  const access_token = await getSalesForceAccessToken();
  const data = JSON.stringify({
    allowSaveOnDuplicate: false,
    fields: {
      Stripe_Invoice_ID__c: stripeinvoiceId,
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
};

exports.salesforceRouter = salesforceRouter;
