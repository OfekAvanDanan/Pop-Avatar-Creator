export type AvatarConfig = {
  bgColor?: string;
  bodyColor?: string;
  skinColor?: string;
  faceType?: number;
  hairType?: number; // used for both Hair_0 and Hair_1
  clothingType?: number; // used for both Clothing_0 and Clothing_1
  faceTexture?: number;
  centerClothing?: number;
  rightClothing?: number;
  leftClothing?: number;
  eyes?: number;
  nose?: number;
  mouth?: number;
  glasses?: number;
};

export function parseAvatarString(input: string): AvatarConfig {
  // Supports comma-separated values, with optional spaces.
  const parts = input
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const val = (i: number): string | number | undefined => parts[i] ?? undefined;
  const num = (i: number): number | undefined => {
    const v = parts[i];
    if (v == null) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? (n as number) : undefined;
  };

  const cfg: AvatarConfig = {
    bgColor: (val(0) as string) || undefined,
    bodyColor: (val(1) as string) || undefined,
    skinColor: (val(2) as string) || undefined,
    faceType: num(3),
    hairType: num(4),
    clothingType: num(5),
    faceTexture: num(6),
    centerClothing: num(7),
    rightClothing: num(8),
    leftClothing: num(9),
    eyes: num(10),
    nose: num(11),
    mouth: num(12),
    glasses: num(13),
  };

  return cfg;
}

export function pad3(n: number | undefined): string | undefined {
  if (n == null || !Number.isFinite(n)) return undefined;
  const i = Math.max(0, Math.floor(n));
  return i.toString().padStart(3, "0");
}

