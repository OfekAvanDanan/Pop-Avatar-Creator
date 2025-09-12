export type AvatarConfig = {
  bgColor?: string;
  bodyColor?: string;
  skinColor?: string;
  hairColor?: string;
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
    .map((p) => p.trim());

  const val = (i: number): string | undefined => {
    const v = parts[i];
    if (v == null || v === "" || v === "0") return undefined;
    return v as string;
  };
  const num = (i: number): number | undefined => {
    const v = parts[i];
    if (v == null || v === "") return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? (n as number) : undefined;
  };

  // Backward compatibility: older strings had no hairColor at index 3.
  // If index 3 is numeric -> treat as old format (faceType at 3), otherwise new format (hairColor at 3).
  const idx3 = parts[3];
  const idx3IsNumeric = idx3 != null && idx3 !== "" && !Number.isNaN(Number(idx3));
  if (idx3IsNumeric) {
    // Old format: [bg, body, skin, face, hairType, clothing, faceTexture, center, right, left, eyes, nose, mouth, glasses]
    return {
      bgColor: val(0),
      bodyColor: val(1),
      skinColor: val(2),
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
    } as AvatarConfig;
  }

  // New format: [bg, body, skin, hairColor, face, hairType, clothing, faceTexture, center, right, left, eyes, nose, mouth, glasses]
  return {
    bgColor: val(0),
    bodyColor: val(1),
    skinColor: val(2),
    hairColor: val(3),
    faceType: num(4),
    hairType: num(5),
    clothingType: num(6),
    faceTexture: num(7),
    centerClothing: num(8),
    rightClothing: num(9),
    leftClothing: num(10),
    eyes: num(11),
    nose: num(12),
    mouth: num(13),
    glasses: num(14),
  } as AvatarConfig;
}

export function pad3(n: number | undefined): string | undefined {
  if (n == null || !Number.isFinite(n)) return undefined;
  const i = Math.max(0, Math.floor(n));
  return i.toString().padStart(3, "0");
}

export function buildAvatarString(cfg: AvatarConfig): string {
  // Keep order (new): bg, body, skin, hairColor, face, hairType, clothing, faceTexture, center, right, left, eyes, nose, mouth, glasses
  const seq: (string | number | undefined)[] = [
    cfg.bgColor,
    cfg.bodyColor,
    cfg.skinColor,
    cfg.hairColor,
    cfg.faceType,
    cfg.hairType,
    cfg.clothingType,
    cfg.faceTexture,
    cfg.centerClothing,
    cfg.rightClothing,
    cfg.leftClothing,
    cfg.eyes,
    cfg.nose,
    cfg.mouth,
    cfg.glasses,
  ];
  return seq
    .map((v) => (v == null || v === '' ? '0' : String(v)))
    .join(',');
}
