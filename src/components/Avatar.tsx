import React from 'react';
import { AvatarConfig, parseAvatarString, pad3 } from '../lib/avatar';

type Props = {
  config?: AvatarConfig;
  configString?: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
};

// ViewBox for all assets (based on files)
const VIEWBOX = { w: 170, h: 221 };

// Helper to create resolvers for folders using require.context
const faceCtx = require.context('../Assets/2_Face', false, /\.\/Face_\d+\.svg$/);
const hair0Ctx = require.context('../Assets/1_Hair_0', false, /\.\/Hair_\d{3}_0\.svg$/);
const hair1Ctx = require.context('../Assets/14_Hair_1', false, /\.\/Hair_\d{3}_1\.svg$/);
const clothing0Ctx = require.context('../Assets/4_Clothing_0', false, /\.\/Clothing_\d+_0\.svg$/);
const clothing1Ctx = require.context('../Assets/9_Clothing_1', false, /\.\/Clothing_\d+_1\.svg$/);
const faceTextureCtx = require.context('../Assets/5_FaceTexture', false, /\.\/FaceTexture_\d+\.svg$/);
const centerClothingCtx = require.context('../Assets/6_Center_Clothing', false, /\.\/CenterClothing_\d+\.svg$/);
const rightClothingCtx = require.context('../Assets/7_Right_Clothing', false, /\.\/RightClothing_\d+\.svg$/);
const leftClothingCtx = require.context('../Assets/8_Left_Clothing', false, /\.\/LeftClothing_\d+\.svg$/);
const glassesCtx = require.context('../Assets/13_Glasses', false, /\.\/Glasses_\d+\.svg$/);

// Optional/Not available yet; keep stubs for future
let eyesCtx: ((k: string) => string) | null = null;
let noseCtx: ((k: string) => string) | null = null;
let mouthCtx: ((k: string) => string) | null = null;
try { eyesCtx = require.context('../Assets/10_Eyes', false, /\.\/Eyes_\d+\.svg$/); } catch {}
try { noseCtx = require.context('../Assets/11_Nose', false, /\.\/Nose_\d+\.svg$/); } catch {}
try { mouthCtx = require.context('../Assets/12_Mouth', false, /\.\/Mouth_\d+\.svg$/); } catch {}

// Single Body asset
const bodyUrl = (() => {
  try {
    const ctx = require.context('../Assets/3_Body', false, /\.\/Body\.svg$/);
    return ctx('./Body.svg');
  } catch {
    return undefined;
  }
})();

function getFaceUrl(id?: number) {
  if (id == null) return undefined;
  const key = `./Face_${id}.svg`;
  try { return faceCtx(key); } catch { return undefined; }
}

function getHair0Url(id?: number) {
  const p = pad3(id);
  if (!p) return undefined;
  const key = `./Hair_${p}_0.svg`;
  try { return hair0Ctx(key); } catch { return undefined; }
}

function getHair1Url(id?: number) {
  const p = pad3(id);
  if (!p) return undefined;
  const key = `./Hair_${p}_1.svg`;
  try { return hair1Ctx(key); } catch { return undefined; }
}

function getClothing0Url(id?: number) {
  if (id == null) return undefined;
  const key = `./Clothing_${id}_0.svg`;
  try { return clothing0Ctx(key); } catch { return undefined; }
}

function getClothing1Url(id?: number) {
  if (id == null) return undefined;
  const key = `./Clothing_${id}_1.svg`;
  try { return clothing1Ctx(key); } catch { return undefined; }
}

function getFaceTextureUrl(id?: number) {
  if (id == null) return undefined;
  const key = `./FaceTexture_${id}.svg`;
  try { return faceTextureCtx(key); } catch { return undefined; }
}

function getCenterClothingUrl(id?: number) {
  if (id == null) return undefined;
  const key = `./CenterClothing_${id}.svg`;
  try { return centerClothingCtx(key); } catch { return undefined; }
}

function getRightClothingUrl(id?: number) {
  if (id == null) return undefined;
  const key = `./RightClothing_${id}.svg`;
  try { return rightClothingCtx(key); } catch { return undefined; }
}

function getLeftClothingUrl(id?: number) {
  if (id == null) return undefined;
  const key = `./LeftClothing_${id}.svg`;
  try { return leftClothingCtx(key); } catch { return undefined; }
}

function getGlassesUrl(id?: number) {
  if (id == null) return undefined;
  const key = `./Glasses_${id}.svg`;
  try { return glassesCtx(key); } catch { return undefined; }
}

function getEyesUrl(id?: number) {
  if (!eyesCtx || id == null) return undefined;
  const key = `./Eyes_${id}.svg`;
  try { return eyesCtx(key); } catch { return undefined; }
}

function getNoseUrl(id?: number) {
  if (!noseCtx || id == null) return undefined;
  const key = `./Nose_${id}.svg`;
  try { return noseCtx(key); } catch { return undefined; }
}

function getMouthUrl(id?: number) {
  if (!mouthCtx || id == null) return undefined;
  const key = `./Mouth_${id}.svg`;
  try { return mouthCtx(key); } catch { return undefined; }
}

export function Avatar(props: Props) {
  const { width, height, className, style } = props;
  const cfg = React.useMemo<AvatarConfig>(() => {
    if (props.config) return props.config;
    if (props.configString) return parseAvatarString(props.configString);
    return {};
  }, [props.config, props.configString]);

  const w = width ?? VIEWBOX.w;
  const h = height ?? VIEWBOX.h;

  // Resolve URLs for all layers (gracefully skip if not found)
  const urls = {
    hair0: getHair0Url(cfg.hairType),
    face: getFaceUrl(cfg.faceType),
    body: bodyUrl,
    clothing0: getClothing0Url(cfg.clothingType),
    faceTexture: getFaceTextureUrl(cfg.faceTexture),
    centerClothing: getCenterClothingUrl(cfg.centerClothing),
    rightClothing: getRightClothingUrl(cfg.rightClothing),
    leftClothing: getLeftClothingUrl(cfg.leftClothing),
    clothing1: getClothing1Url(cfg.clothingType),
    eyes: getEyesUrl(cfg.eyes),
    nose: getNoseUrl(cfg.nose),
    mouth: getMouthUrl(cfg.mouth),
    glasses: getGlassesUrl(cfg.glasses),
    hair1: getHair1Url(cfg.hairType),
  } as const;

  // Layer order per spec (0..14):
  // 0 Background, 1 Hair_0, 2 Face, 3 Body, 4 Clothing_0, 5 Face texture, 6 Center, 7 Right, 8 Left, 9 Clothing_1, 10 Eyes, 11 Nose, 12 Mouth, 13 Glasses, 14 Hair_1
  const layers: (string | undefined)[] = [
    undefined, // background handled separately
    urls.hair0,
    urls.face,
    urls.body,
    urls.clothing0,
    urls.faceTexture,
    urls.centerClothing,
    urls.rightClothing,
    urls.leftClothing,
    urls.clothing1,
    urls.eyes,
    urls.nose,
    urls.mouth,
    urls.glasses,
    urls.hair1,
  ];

  // Note on colors: background is supported. Body/skin recoloring is not applied yet because SVGs contain internal styles.
  // If needed, we can enhance later by inlining and overriding fills.

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
      width={w}
      height={h}
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background color */}
      <rect x={0} y={0} width={VIEWBOX.w} height={VIEWBOX.h} fill={cfg.bgColor || 'transparent'} />

      {/* Stack all layer images */}
      {layers.map((href, idx) =>
        href ? (
          <image
            key={idx}
            href={href}
            x={0}
            y={0}
            width={VIEWBOX.w}
            height={VIEWBOX.h}
            preserveAspectRatio="xMidYMid meet"
          />
        ) : null
      )}
    </svg>
  );
}

export default Avatar;
