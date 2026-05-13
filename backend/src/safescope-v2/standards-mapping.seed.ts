export type SafeScopeStandardMapping = {
  citation: string;
  agency: 'MSHA' | 'OSHA';
  scope: 'msha' | 'osha_general' | 'osha_construction';
  rationale: string;
};

export const STANDARDS_MAPPING: Record<string, SafeScopeStandardMapping[]> = {
  Electrical: [
    {
      citation: '30 CFR 56.12016',
      agency: 'MSHA',
      scope: 'msha',
      rationale: 'Electrical conductors exposed to mechanical damage',
    },
    {
      citation: '1910.303(b)(1)',
      agency: 'OSHA',
      scope: 'osha_general',
      rationale: 'Electric equipment must be free from recognized hazards',
    },
  ],

  "Machine Guarding": [
    {
      citation: '30 CFR 56.14107(a)',
      agency: 'MSHA',
      scope: 'msha',
      rationale: 'Moving machine parts shall be guarded',
    },
    {
      citation: '1910.212(a)(1)',
      agency: 'OSHA',
      scope: 'osha_general',
      rationale: 'Machine guarding required for points of operation',
    },
    {
      citation: '1910.219',
      agency: 'OSHA',
      scope: 'osha_general',
      rationale: 'Mechanical power-transmission apparatus must be guarded',
    },
  ],

  Machine: [
    {
      citation: '30 CFR 56.14107(a)',
      agency: 'MSHA',
      scope: 'msha',
      rationale: 'Moving machine parts shall be guarded',
    },
    {
      citation: '1910.212(a)(1)',
      agency: 'OSHA',
      scope: 'osha_general',
      rationale: 'Machine guarding required for points of operation',
    },
  ],

  Fall: [
    {
      citation: '30 CFR 56.11012',
      agency: 'MSHA',
      scope: 'msha',
      rationale: 'Openings above, below, or near travelways must be protected',
    },
    {
      citation: '1926.501(b)(1)',
      agency: 'OSHA',
      scope: 'osha_construction',
      rationale: 'Fall protection required for unprotected sides and edges',
    },
  ],

  PPE: [
    {
      citation: '1910.132(a)',
      agency: 'OSHA',
      scope: 'osha_general',
      rationale: 'Protective equipment required where hazards exist',
    },
    {
      citation: '1910.135(a)',
      agency: 'OSHA',
      scope: 'osha_general',
      rationale: 'Protective helmets required where head injury hazards exist',
    },
    {
      citation: '1910.133(a)',
      agency: 'OSHA',
      scope: 'osha_general',
      rationale: 'Eye and face protection required where hazards exist',
    },
  ],

  Housekeeping: [
    {
      citation: '1910.22(a)',
      agency: 'OSHA',
      scope: 'osha_general',
      rationale: 'Walking-working surfaces must be maintained clean and orderly',
    },
    {
      citation: '30 CFR 56.20003',
      agency: 'MSHA',
      scope: 'msha',
      rationale: 'Workplaces, passageways, and travelways must be kept clean and orderly',
    },
  ],

  'Powered Mobile Equipment': [
    {
      citation: '1910.178',
      agency: 'OSHA',
      scope: 'osha_general',
      rationale: 'Powered industrial truck operation and safety requirements',
    },
    {
      citation: '30 CFR 56.9100',
      agency: 'MSHA',
      scope: 'msha',
      rationale: 'Mobile equipment operators must maintain control of equipment',
    },
    {
      citation: '30 CFR 56.9200',
      agency: 'MSHA',
      scope: 'msha',
      rationale: 'Traffic control and safe movement of equipment near persons',
    },
  ],

  'Hazard Communication': [
    {
      citation: '1910.1200',
      agency: 'OSHA',
      scope: 'osha_general',
      rationale: 'Hazard communication requirements for chemical containers and labels',
    },
  ],

  Access: [
    {
      citation: '30 CFR 56.11001',
      agency: 'MSHA',
      scope: 'msha',
      rationale: 'Safe access must be provided and maintained',
    },
  ],
};
