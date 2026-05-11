export const STANDARDS_MAPPING: Record<
  string,
  { citation: string; rationale: string }[]
> = {
  Electrical: [
    {
      citation: '30 CFR 56.12016',
      rationale: 'Electrical conductors exposed to mechanical damage',
    },
    {
      citation: '1910.303(b)(1)',
      rationale: 'Electric equipment must be free from recognized hazards',
    },
  ],

  Machine: [
    {
      citation: '30 CFR 56.14107(a)',
      rationale: 'Moving machine parts shall be guarded',
    },
    {
      citation: '1910.212(a)(1)',
      rationale: 'Machine guarding required for points of operation',
    },
  ],

  Fall: [
    {
      citation: '30 CFR 56.11012',
      rationale: 'Openings above, below, or near travelways must be protected',
    },
    {
      citation: '1926.501(b)(1)',
      rationale: 'Fall protection required for unprotected sides and edges',
    },
  ],

  PPE: [
    {
      citation: '1910.132(a)',
      rationale: 'Protective equipment required where hazards exist',
    },
  ],

  Housekeeping: [
    {
      citation: '1910.22(a)',
      rationale: 'Walking-working surfaces must be maintained clean and orderly',
    },
  ],

  'Powered Mobile Equipment': [
    {
      citation: '1910.178',
      rationale: 'Powered industrial truck operation and safety requirements',
    },
    {
      citation: '30 CFR 56.9100',
      rationale: 'Mobile equipment operators must maintain control of equipment',
    },
    {
      citation: '30 CFR 56.9200',
      rationale: 'Traffic control and safe movement of equipment near persons',
    },
  ],

  'Hazard Communication': [
    {
      citation: '1910.1200',
      rationale: 'Hazard communication requirements for chemical containers and labels',
    },
  ],

  Access: [
    {
      citation: '30 CFR 56.11001',
      rationale: 'Safe access must be provided and maintained',
    },
  ],
};
