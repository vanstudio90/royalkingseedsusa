/**
 * Accept.Blue Payment Gateway - Server-side API client
 * Uses the source key + pin provided by the merchant account provider.
 * Card data is sent server-to-server (same as the WooCommerce plugin).
 */

const API_URL = (process.env.ACCEPT_BLUE_API_URL || 'https://api.accept.blue/api/v2').trim();
const API_KEY = (process.env.ACCEPT_BLUE_API_KEY || '').trim();
const PIN = (process.env.ACCEPT_BLUE_PIN || '').trim();

function getAuthHeader(): string {
  const credentials = Buffer.from(`${API_KEY}:${PIN}`).toString('base64');
  return `Basic ${credentials}`;
}

export interface ChargeRequest {
  amount: number;
  card: string;
  expiry_month: number;
  expiry_year: number;
  cvv2: string;
  name?: string;
  billing_info?: {
    first_name?: string;
    last_name?: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    phone?: string;
    email?: string;
  };
  shipping_info?: {
    first_name?: string;
    last_name?: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  transaction_details?: {
    description?: string;
    invoice_number?: string;
    order_number?: string;
    client_ip?: string;
  };
  amount_details?: {
    tax?: number;
    shipping?: number;
    subtotal?: number;
  };
  custom_fields?: {
    custom1?: string;
  };
}

export interface ChargeResponse {
  status: 'Approved' | 'Partially Approved' | 'Declined' | 'Error';
  status_code: 'A' | 'P' | 'D' | 'E';
  error_message: string;
  error_code: string;
  reference_number: number;
  auth_amount: number;
  auth_code: string;
  avs_result: string;
  avs_result_code: string;
  cvv2_result: string;
  cvv2_result_code: string;
  card_type: string;
  last_4: string;
  transaction?: {
    id: number;
    created_at: string;
  };
}

export async function processCharge(data: ChargeRequest): Promise<ChargeResponse> {
  if (!API_KEY) {
    throw new Error('ACCEPT_BLUE_API_KEY is not configured');
  }

  const url = `${API_URL}/transactions/charge`;
  const body = JSON.stringify({ ...data, capture: true });

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getAuthHeader(),
    },
    body,
  });

  const responseText = await res.text();

  if (!res.ok) {
    throw new Error(`Accept.Blue API error (${res.status}): ${responseText}`);
  }

  let parsed: ChargeResponse;
  try {
    parsed = JSON.parse(responseText);
  } catch {
    throw new Error(`Accept.Blue returned invalid JSON: ${responseText.slice(0, 200)}`);
  }

  return parsed;
}
