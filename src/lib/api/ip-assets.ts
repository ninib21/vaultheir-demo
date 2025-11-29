import { apiClient } from './client';

export interface IPAsset {
  id: string;
  userId: string;
  name: string;
  type: 'patent' | 'trademark' | 'copyright' | 'trade-secret';
  description?: string;
  hederaTransactionId?: string;
  status: 'draft' | 'pending' | 'notarized' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface CreateIPAssetDto {
  name: string;
  type: 'patent' | 'trademark' | 'copyright' | 'trade-secret';
  description?: string;
}

export interface NotarizeResponse {
  success: boolean;
  transactionId: string;
  asset: IPAsset;
}

/**
 * Get all IP assets for a user
 */
export async function getIPAssets(userId: string): Promise<IPAsset[]> {
  const response = await apiClient.get<IPAsset[]>(`/ip-assets?userId=${userId}`);
  return response.data;
}

/**
 * Get a single IP asset by ID
 */
export async function getIPAsset(id: string): Promise<IPAsset> {
  const response = await apiClient.get<IPAsset>(`/ip-assets/${id}`);
  return response.data;
}

export async function getAllAssets(): Promise<IPAsset[]> {
  const response = await apiClient.get<IPAsset[]>('/ip-assets');
  return response.data;
}

/**
 * Create a new IP asset
 */
export async function createIPAsset(data: CreateIPAssetDto): Promise<IPAsset> {
  const response = await apiClient.post<IPAsset>('/ip-assets', data);
  return response.data;
}

/**
 * Notarize an IP asset on Hedera blockchain
 */
export async function notarizeIPAsset(
  id: string,
  content: string | File
): Promise<NotarizeResponse> {
  const formData = new FormData();
  
  if (content instanceof File) {
    formData.append('file', content);
  } else {
    formData.append('content', content);
  }

  const response = await apiClient.post<NotarizeResponse>(
    `/ip-assets/${id}/notarize`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
}

