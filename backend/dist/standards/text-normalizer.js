"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeObservationText = normalizeObservationText;
exports.isNegativeControl = isNegativeControl;
const REPLACEMENTS = {
    frklft: 'forklift',
    frklt: 'forklift',
    flt: 'forklift',
    trning: 'training',
    trng: 'training',
    seatbelt: 'seat belt',
    'fall prot': 'fall protection',
    'fall pro': 'fall protection',
    '12ft': '12 feet',
    '10ft': '10 feet',
    '9ft': '9 feet',
    conveyer: 'conveyor',
    gard: 'guard',
    grd: 'guard',
    pully: 'pulley',
    laddder: 'ladder',
    lader: 'ladder',
    loto: 'lockout tagout',
    'middle rail': 'midrail guardrail',
    midrail: 'guardrail',
    'hydro oil': 'hydraulic oil',
    oill: 'oil',
    prot: 'protection',
    'w no': 'with no',
    '480v': '480 volt',
};
const NEGATIVE_PATTERNS = [
    'cleaned up',
    'cleaned and salted',
    'corrected',
    'repaired',
    'fixed',
    'resolved',
    'inspected secure',
    'found secure',
    'guard installed',
    'no issue found',
    'compliant',
    'in compliance',
    'acceptable condition',
    'verified safe',
];
function normalizeObservationText(input) {
    let text = ` ${input.toLowerCase()} `;
    for (const [bad, good] of Object.entries(REPLACEMENTS)) {
        text = text.replace(new RegExp(`\\b${bad}\\b`, 'g'), good);
    }
    text = text
        .replace(/(\d+)\s?ft\b/g, '$1 feet')
        .replace(/\s+/g, ' ')
        .trim();
    return text;
}
function isNegativeControl(input) {
    const text = normalizeObservationText(input);
    return NEGATIVE_PATTERNS.some((pattern) => text.includes(pattern));
}
//# sourceMappingURL=text-normalizer.js.map