// Central palette master using two-letter codes mapped to hex colors
// COLOR_MAP defines the canonical hex for each short code
export const COLOR_MAP: Record<string, string> = {
  // Skin tones
  SA: '#F1C9B0',
  SB: '#E7B190',
  SC: '#D69B77',
  SD: '#C18462',
  SE: '#A96B4F',
  SF: '#7A3D28',
  SG: '#603020',
  // Common colors
  YE: '#EFB108', // Yellow/Gold
  BK: '#0E0107', // Black
  PK: '#E62786', // Pink/Magenta
  RD: '#CA0D0E', // Red
  WH: '#F2DFE8', // Off-white / Rose
  BL: '#0096E0', // Blue
  GN: '#178F2F', // Green
  DB: '#3c2415', // Dark Brown
  LB: '#95592eff', // Light/Medium Brown
  OR: '#cc4c1aff', // Orange/Brown
  GY: '#91948cff', // Gray
};

// Helper: resolve two-letter code or pass-through hex/color string
export function toHex(codeOrHex?: string): string | undefined {
  if (!codeOrHex) return undefined;
  const key = codeOrHex.toUpperCase();
  return COLOR_MAP[key] ?? codeOrHex;
}

// Category palettes now contain two-letter color codes
export const SKIN_COLORS = ['SA', 'SB', 'SC', 'SD', 'SE', 'SF', 'SG'];
export const CLOTH_COLORS = ['YE', 'BK', 'PK', 'RD', 'WH', 'BL', 'GN'];
export const HAIR_COLORS = ['BK', 'DB', 'LB', 'YE', 'OR', 'GY', 'PK'];
export const BG_COLORS = ['YE', 'BK', 'PK', 'RD', 'WH', 'BL', 'GN'];

// Export a single object for convenience (still arrays of codes)
export const PALETTE = {
  skin: SKIN_COLORS,
  clothing: CLOTH_COLORS,
  hair: HAIR_COLORS,
  background: BG_COLORS,
};
