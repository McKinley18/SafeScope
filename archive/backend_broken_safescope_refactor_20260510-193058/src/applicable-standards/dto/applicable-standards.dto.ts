export class SuggestStandardsDto {
  description: string;
  hazardCategory: string;
  source: 'MSHA' | 'OSHA';
  limit?: number;
}
