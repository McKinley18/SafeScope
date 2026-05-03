import { HazardType } from './hazard.types';

export const classifyHazard = (text: string): HazardType | null => {
  const t = text.toLowerCase();

  if (t.includes('railing') || t.includes('edge') || t.includes('fall')) {
    return HazardType.FALL;
  }

  if (t.includes('electrical') || t.includes('wire')) {
    return HazardType.ELECTRICAL;
  }

  return null;
};
