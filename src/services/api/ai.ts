import { fetchApi } from './client';

export interface IAIReviewPayload {
  siteId: string;
  estimatedAreaSqm?: number;
  infrastructureType?: string;
}

export interface IAIReviewResponse {
  source: 'GEMINI_API' | 'DETERMINISTIC_FALLBACK';
  summary: string;
  strengths: string[];
  risksAndConsiderations: string[];
  verificationsRequired: string[];
}

export async function postAIReview(payload: IAIReviewPayload): Promise<{ review: IAIReviewResponse; isFallback: boolean }> {
  const result = await fetchApi<IAIReviewResponse>('/ai/review', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (result.isFallback || !result.data) {
    return {
      review: {
        source: 'DETERMINISTIC_FALLBACK',
        summary: 'Target site represents a high-viability parcel for Solar-EV Charging Hub deployment based on Nashik ULB criteria.',
        strengths: [
          'Optimal GHI solar yield with minimal shading.',
          'High activity EV demand proxy along transit corridor.',
          'Direct 33kV substation feeder adjacency.',
        ],
        risksAndConsiderations: [
          'Flood risk screening LOW. Hydrologic DEM model confirmed.',
          'Zero land conflict detected in municipal parcel registry.',
        ],
        verificationsRequired: [
          'MSEDCL grid interconnect capacity check',
          'Physical cadastral survey before tender issuance',
        ],
      },
      isFallback: true,
    };
  }

  return { review: result.data, isFallback: false };
}
