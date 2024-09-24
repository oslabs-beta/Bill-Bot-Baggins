export const GRAPH_QL_QUERY = JSON.stringify({
  query: `query payments {
      uiapi {
        query {
          npe01__OppPayment__c {
            edges {
              node {
                Id
                Invoice__c {
                    value
                }
                Invoice_Sent_Date__c {
                    value
                }
                npe01__Payment_Amount__c {
                    value
                }
                Opportunity_Account_Name__c {
                    value
                }
                Opportunity_18_Digit_ID__c {
                    value
                }
                Project_Number__c {
                  value
                  }
                npe01__Payment_Method__c {
                    value
                }
                npe01__Payment_Date__c {
                    value
                }
                npe01__Scheduled_Date__c{
                    value
                }
              }
            }
          }
        }
      }
    }`,
  variables: {},
});
