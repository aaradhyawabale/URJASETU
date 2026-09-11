import { fetchApi } from './client';

export interface IHealthStatus {
  status: string;
  service: string;
  version: string;
  demoCity: string;
}

export async function getHealth(): Promise<{ health: IHealthStatus | null; isFallback: boolean }> {
  const result = await fetchApi<IHealthStatus>('/health');
  if (result.isFallback || !result.data) {
    return { health: null, isFallback: true };
  }
  return { health: result.data, isFallback: false };
}
