import { apiClient } from './client';

export interface HederaNotarizeResponse {
  success: boolean;
  transactionId: string;
  timestamp: string;
}

export interface HederaNotarizePayload {
  content: string;
  metadata?: Record<string, any>;
}

export async function notarizeWithHedera(
  payload: HederaNotarizePayload
): Promise<HederaNotarizeResponse> {
  const response = await apiClient.post<HederaNotarizeResponse>(
    '/hedera/notarize',
    payload
  );
  return response.data;
}

