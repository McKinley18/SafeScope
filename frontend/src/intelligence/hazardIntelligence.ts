type Standard = {
  id: string;
  source: 'MSHA';
  citation: string;
  title: string;
  category: string;
  keywords: string[];
  verificationNote: string;
};

type HazardRule = {
  name: string;
  confidence: 'high' | 'medium' | 'low';
  terms: string[];
  standards: Standard[];
};

const rules: HazardRule[] = [
  {
    name: 'Unguarded moving machine parts',
    confidence: 'high',
    terms: ['guard', 'unguarded', 'conveyor', 'pulley', 'belt', 'roller', 'shaft', 'pinch point', 'moving parts'],
    standards: [
      {
        id: 'msha-56-14107',
        source: 'MSHA',
        citation: '30 CFR 56.14107',
        title: 'Moving machine parts guarding',
        category: 'Machine Guarding',
        keywords: ['guard', 'unguarded', 'conveyor', 'pulley', 'belt'],
        verificationNote: 'Verify moving parts exposure and guarding requirements before submission.',
      },
    ],
  },
  {
    name: 'Poor housekeeping / material buildup',
    confidence: 'medium',
    terms: ['housekeeping', 'debris', 'spillage', 'buildup', 'trash', 'clutter', 'walkway', 'trip'],
    standards: [
      {
        id: 'msha-56-20003',
        source: 'MSHA',
        citation: '30 CFR 56.20003',
        title: 'Housekeeping',
        category: 'Housekeeping',
        keywords: ['housekeeping', 'debris', 'spillage', 'buildup'],
        verificationNote: 'Verify unsafe accumulation, access interference, or slip/trip exposure.',
      },
    ],
  },
  {
    name: 'Unsafe access or egress',
    confidence: 'medium',
    terms: ['access', 'egress', 'blocked', 'walkway', 'travelway', 'ladder', 'stairs', 'platform'],
    standards: [
      {
        id: 'msha-56-11001',
        source: 'MSHA',
        citation: '30 CFR 56.11001',
        title: 'Safe access',
        category: 'Access / Egress',
        keywords: ['access', 'egress', 'walkway', 'travelway', 'ladder'],
        verificationNote: 'Verify the condition affects required safe access or travel.',
      },
    ],
  },
  {
    name: 'Electrical exposure',
    confidence: 'high',
    terms: ['electrical', 'panel', 'cover', 'junction box', 'wire', 'cable', 'cord', 'conductor', 'exposed', 'damaged insulation'],
    standards: [
      {
        id: 'msha-56-12032',
        source: 'MSHA',
        citation: '30 CFR 56.12032',
        title: 'Inspection and cover plates',
        category: 'Electrical',
        keywords: ['electrical panel', 'cover', 'junction box', 'open panel'],
        verificationNote: 'Verify missing covers, open enclosures, or exposed electrical components.',
      },
      {
        id: 'msha-56-12004',
        source: 'MSHA',
        citation: '30 CFR 56.12004',
        title: 'Electrical conductors',
        category: 'Electrical',
        keywords: ['cable', 'cord', 'conductor', 'insulation', 'wire'],
        verificationNote: 'Verify conductor condition and exposure to contact or damage.',
      },
    ],
  },
  {
    name: 'Fall exposure',
    confidence: 'high',
    terms: ['fall', 'edge', 'opening', 'hole', 'guardrail', 'handrail', 'harness', 'lanyard', 'tie off', 'height'],
    standards: [
      {
        id: 'msha-56-15005',
        source: 'MSHA',
        citation: '30 CFR 56.15005',
        title: 'Safety belts and lines',
        category: 'Fall Protection',
        keywords: ['fall protection', 'harness', 'lanyard', 'tie off'],
        verificationNote: 'Verify elevated work exposure and fall protection requirements.',
      },
      {
        id: 'msha-56-11012',
        source: 'MSHA',
        citation: '30 CFR 56.11012',
        title: 'Protection for openings around travelways',
        category: 'Fall / Opening Protection',
        keywords: ['opening', 'hole', 'guardrail', 'handrail'],
        verificationNote: 'Verify travelway proximity and opening protection requirements.',
      },
    ],
  },
  {
    name: 'Lockout / energy control deficiency',
    confidence: 'high',
    terms: ['lockout', 'tagout', 'locked out', 'stored energy', 'maintenance', 'repair', 'deenergize', 'blocked against motion'],
    standards: [
      {
        id: 'msha-56-14105',
        source: 'MSHA',
        citation: '30 CFR 56.14105',
        title: 'Procedures during repairs or maintenance',
        category: 'Lockout / Maintenance',
        keywords: ['lockout', 'tagout', 'maintenance', 'repair', 'stored energy'],
        verificationNote: 'Verify repair/maintenance activity and energy-control requirements.',
      },
    ],
  },
  {
    name: 'Missing barricade or warning sign',
    confidence: 'medium',
    terms: ['barricade', 'warning', 'sign', 'danger', 'posted', 'restricted', 'tape', 'unmarked'],
    standards: [
      {
        id: 'msha-56-20011',
        source: 'MSHA',
        citation: '30 CFR 56.20011',
        title: 'Barricades and warning signs',
        category: 'Barricades / Signage',
        keywords: ['barricade', 'warning sign', 'danger', 'posted'],
        verificationNote: 'Verify whether the hazard requires warning signs or access restriction.',
      },
    ],
  },
  {
    name: 'Mobile equipment traffic hazard',
    confidence: 'high',
    terms: ['traffic', 'haul road', 'mobile equipment', 'loader', 'truck', 'blind spot', 'spotter', 'pedestrian'],
    standards: [
      {
        id: 'msha-56-9100',
        source: 'MSHA',
        citation: '30 CFR 56.9100',
        title: 'Traffic control',
        category: 'Mobile Equipment / Traffic',
        keywords: ['traffic', 'haul road', 'mobile equipment', 'spotter'],
        verificationNote: 'Verify mobile equipment interaction, visibility, and traffic-control exposure.',
      },
    ],
  },
  {
    name: 'Missing or inadequate berm',
    confidence: 'high',
    terms: ['berm', 'guardrail', 'dump point', 'edge protection', 'haul road edge', 'drop off'],
    standards: [
      {
        id: 'msha-56-9300',
        source: 'MSHA',
        citation: '30 CFR 56.9300',
        title: 'Berms or guardrails',
        category: 'Roadways / Berms',
        keywords: ['berm', 'guardrail', 'dump point', 'roadway edge'],
        verificationNote: 'Verify roadway/dump-point berm requirements and mobile equipment exposure.',
      },
    ],
  },
  {
    name: 'PPE deficiency',
    confidence: 'medium',
    terms: ['ppe', 'hard hat', 'helmet', 'safety glasses', 'goggles', 'face shield', 'boots', 'footwear'],
    standards: [
      {
        id: 'msha-56-15002',
        source: 'MSHA',
        citation: '30 CFR 56.15002',
        title: 'Hard hats',
        category: 'PPE',
        keywords: ['hard hat', 'helmet', 'head protection'],
        verificationNote: 'Verify head protection exposure and site PPE requirements.',
      },
      {
        id: 'msha-56-15003',
        source: 'MSHA',
        citation: '30 CFR 56.15003',
        title: 'Protective footwear',
        category: 'PPE',
        keywords: ['boots', 'footwear', 'protective footwear'],
        verificationNote: 'Verify footwear exposure and site PPE requirements.',
      },
      {
        id: 'msha-56-15004',
        source: 'MSHA',
        citation: '30 CFR 56.15004',
        title: 'Eye protection',
        category: 'PPE',
        keywords: ['eye protection', 'safety glasses', 'goggles', 'face shield'],
        verificationNote: 'Verify eye/face exposure from the task.',
      },
    ],
  },
];

const normalize = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();

export function analyzeHazardContext(input: {
  hazardDescription?: string;
  area?: string;
  equipment?: string;
  workActivity?: string;
  notes?: string;
}) {
  const text = normalize(
    [input.hazardDescription, input.area, input.equipment, input.workActivity, input.notes]
      .filter(Boolean)
      .join(' ')
  );

  if (!text) return [];

  return rules
    .map((rule) => {
      const matchedTerms = rule.terms.filter((term) => text.includes(normalize(term)));
      if (matchedTerms.length === 0) return null;

      return {
        hazard: { name: rule.name },
        confidence:
          matchedTerms.length >= 3 ? rule.confidence : matchedTerms.length === 2 ? 'medium' : 'low',
        matchedTerms,
        standards: rule.standards,
      };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => b.matchedTerms.length - a.matchedTerms.length);
}
