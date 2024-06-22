'use server';

import prisma from '../lib/db';
import { getToken } from 'sf-jwt-token';
import { InvoiceProps } from '../lib/types';
import { PaymentInfoSchema } from '../lib/validations/salesforce';
import { GRAPH_QL_QUERY } from '../lib/constants';
import Stripe from 'stripe';
import { Prisma } from '@prisma/client';
import { loginFormSchema } from '../lib/validations/form';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { signIn, signOut } from '../lib/auth';
import { redirect } from 'next/navigation';

// -- ENV variables --

const {
  SALESFORCE_CLIENT_ID,
  SALESFORCE_USERNAME,
  SALESFORCE_URL,
  BASE64_PRIVATE_KEY,
  STRIPE_SECRET_KEY,
  SALESFORCE_GRAPHQL_URI,
  SALESFORCE_COOKIE_AUTH,
} = process.env;

// -- User actions
export async function logIn(prevState: unknown, formData: unknown) {
  if (!(formData instanceof FormData)) {
    return {
      message: 'Invalid form data.',
    };
  }

  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin': {
          return {
            message: 'Invalid credentials.',
          };
        }
        default: {
          return {
            message: 'Error. Could not sign in.',
          };
        }
      }
    }
    redirect('/app/dashboard');
  }
}

export async function signUp(prevState: unknown, formData: unknown) {
  // check if formData is a FormData type
  if (!(formData instanceof FormData)) {
    return {
      message: 'Invalid form data.',
    };
  }

  // convert formData to a JS object
  const formDataEntries = Object.fromEntries(formData.entries());
  const validatedFormData = loginFormSchema.safeParse(formDataEntries);

  // validation
  if (!validatedFormData.success) {
    return {
      message: 'Invalid form data.',
    };
  }

  const { email, password } = validatedFormData.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return {
          message: 'Email already exists.',
        };
      }
    }
  }

  try {
    await signIn('credentials', formData);
  } catch (error) {
    redirect('/app/dashboard');
  }
}

export async function logOut() {
  await signOut({ redirectTo: '/' });
}

// -- Salesforce actions

const getSalesForceAccessToken = async () => {
  if (
    !BASE64_PRIVATE_KEY ||
    !SALESFORCE_CLIENT_ID ||
    !SALESFORCE_USERNAME ||
    !SALESFORCE_URL
  ) {
    throw new Error('Required environment variables are not set.');
  }
  // convert the base64 private key into a string
  const privateKey = Buffer.from(BASE64_PRIVATE_KEY, 'base64').toString('utf8');

  try {
    // gets a new access token from sales force (if it hasn't expired it will send the active token)
    const jwtTokenResponse = await getToken({
      iss: SALESFORCE_CLIENT_ID,
      sub: SALESFORCE_USERNAME,
      aud: SALESFORCE_URL,
      privateKey,
    });

    return jwtTokenResponse.access_token;
  } catch (error) {
    console.error('Failed to get token:', error);
    throw new Error('Could not get access token');
  }
};

export const getSalesForceInvoiceData = async () => {
  if (!SALESFORCE_GRAPHQL_URI || !SALESFORCE_COOKIE_AUTH) {
    throw new Error('Required environment variables are not set.');
  }

  // Retrieve updated (or still active) access token
  const accessToken = await getSalesForceAccessToken();

  try {
    const res = await fetch(SALESFORCE_GRAPHQL_URI, {
      method: 'POST', // method is capitalized in fetch
      headers: {
        'X-Chatter-Entity-Encoding': 'false',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        Cookie: SALESFORCE_COOKIE_AUTH,
      },
      body: GRAPH_QL_QUERY,
    });

    const salesForceData = await res.json();

    const validatedSalesForceData = PaymentInfoSchema.safeParse(salesForceData);
    if (!validatedSalesForceData.success) {
      throw new Error('Invalid Salesforce data');
    }
    // retrieve all invoice information from salesforce graphql call
    const paymentInfo =
      validatedSalesForceData.data.data.uiapi.query.npe01__OppPayment__c.edges;

    return paymentInfo.map((record: InvoiceProps) => {
      const { node } = record;

      return {
        sf_unique_id: node.Id,
        invoice_id: node.Invoice__c.value,
        amount: node.npe01__Payment_Amount__c.value,
        invoice_sent_date: node.Invoice_Sent_Date__c.value,
        payment_date: node.npe01__Payment_Date__c.value,
        invoice_due_date: node.npe01__Scheduled_Date__c.value,
        payment_method: node.npe01__Payment_Method__c.value,
        project_name: node.Project_Number__c.value,
        account_name: node.Opportunity_Account_Name__c.value,
      };
    });
  } catch (error) {
    console.error(error);
    throw new Error('Could not get Salesforce data');
  }
};

// -- Stripe actions --

export const getStripeInvoiceData = async (
  invoiceId: string
): Promise<Stripe.Response<Stripe.Invoice> | undefined> => {
  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2023-08-16',
    typescript: true,
  });
  try {
    const invoice = await stripe.invoices.retrieve(invoiceId);
    return invoice;
  } catch (error) {
    console.error('Could not get Stripe invoice: ', error);
  }
};
