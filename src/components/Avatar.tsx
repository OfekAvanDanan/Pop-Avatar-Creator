import React from "react";
import { AvatarConfig, parseAvatarString, pad3 } from "../lib/avatar";
// Polyfill require.context for tests before using it
import "../polyfills/requireContext";
import {
  faceCtx,
  hair0Ctx,
  hair1Ctx,
  clothing0Ctx,
  clothing1Ctx,
  faceTextureCtx,
  centerClothingCtx,
  rightClothingCtx,
  leftClothingCtx,
  glassesCtx,
} from "../lib/assetContexts";

type Props = {
  config?: AvatarConfig;
  configString?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  hideBackground?: boolean;
  cover?: boolean; // true: cover (slice), false: contain (meet)
};

// ViewBox for all assets (based on original SVGs)
const VIEWBOX = { w: 170, h: 221 };

// Shared caches across all Avatar instances to avoid duplicate fetch+process work
const GLOBAL_COLORIZED_CACHE = new Map<string, string>();
const GLOBAL_INFLIGHT = new Map<string, Promise<string>>();

// Direct require.context calls were moved to src/lib/assetContexts for modularity

// Optional/Not available yet; keep stubs for future
let eyesCtx: ((k: string) => string) | null = null;
let noseCtx: ((k: string) => string) | null = null;
let mouthCtx: ((k: string) => string) | null = null;
try {
  eyesCtx = require.context("../Assets/10_Eyes", false, /\.\/Eyes_\d+\.svg$/);
} catch {}
try {
  noseCtx = require.context("../Assets/11_Nose", false, /\.\/Nose_\d+\.svg$/);
} catch {}
try {
  mouthCtx = require.context("../Assets/12_Mouth", false, /\.\/Mouth_\d+\.svg$/);
} catch {}

// Single Body asset
const bodyUrl = (() => {
  try {
    const ctx = require.context("../Assets/3_Body", false, /\.\/Body\.svg$/);
    return ctx("./Body.svg");
  } catch {
    return undefined;
  }
})();

function getFaceUrl(id?: number) {
  if (id == null) return undefined;
  const key = `./Face_${id}.svg`;
  try {
    return faceCtx(key);
  } catch {
    return undefined;
  }
}

function getHair0Url(id?: number) {
  const p = pad3(id);
  if (!p) return undefined;
  const key = `./Hair_${p}_0.svg`;
  try {
    return hair0Ctx(key);
  } catch {
    return undefined;
  }
}

function getHair1Url(id?: number) {
  const p = pad3(id);
  if (!p) return undefined;
  const key = `./Hair_${p}_1.svg`;
  try {
    return hair1Ctx(key);
  } catch {
    return undefined;
  }
}

function getClothing0Url(id?: number) {
  if (id == null) return undefined;
  const key = `./Clothing_${id}_0.svg`;
  try {
    return clothing0Ctx(key);
  } catch {
    return undefined;
  }
}

function getClothing1Url(id?: number) {
  if (id == null) return undefined;
  const key = `./Clothing_${id}_1.svg`;
  try {
    return clothing1Ctx(key);
  } catch {
    return undefined;
  }
}

function getFaceTextureUrl(id?: number) {
  if (id == null) return undefined;
  const key = `./FaceTexture_${id}.svg`;
  try {
    return faceTextureCtx(key);
  } catch {
    return undefined;
  }
}

function getCenterClothingUrl(id?: number) {
  if (id == null) return undefined;
  const key = `./CenterClothing_${id}.svg`;
  try {
    return centerClothingCtx(key);
  } catch {
    return undefined;
  }
}

function getRightClothingUrl(id?: number) {
  if (id == null) return undefined;
  const key = `./RightClothing_${id}.svg`;
  try {
    return rightClothingCtx(key);
  } catch {
    return undefined;
  }
}

function getLeftClothingUrl(id?: number) {
  if (id == null) return undefined;
  const key = `./LeftClothing_${id}.svg`;
  try {
    return leftClothingCtx(key);
  } catch {
    return undefined;
  }
}

function getGlassesUrl(id?: number) {
  if (id == null) return undefined;
  const key = `./Glasses_${id}.svg`;
  try {
    return glassesCtx(key);
  } catch {
    return undefined;
  }
}

function getEyesUrl(id?: number) {
  if (!eyesCtx || id == null) return undefined;
  const key = `./Eyes_${id}.svg`;
  try {
    return eyesCtx(key);
  } catch {
    return undefined;
  }
}

function getNoseUrl(id?: number) {
  if (!noseCtx || id == null) return undefined;
  const key = `./Nose_${id}.svg`;
  try {
    return noseCtx(key);
  } catch {
    return undefined;
  }
}

function getMouthUrl(id?: number) {
  if (!mouthCtx || id == null) return undefined;
  const key = `./Mouth_${id}.svg`;
  try {
    return mouthCtx(key);
  } catch {
    return undefined;
  }
}

export function Avatar(props: Props) {
  const { width, height, className, style, hideBackground, cover = true } = props;
  const cfg = React.useMemo<AvatarConfig>(() => {
    if (props.config) return props.config;
    if (props.configString) return parseAvatarString(props.configString);
    return {};
  }, [props.config, props.configString]);

  const w = width ?? VIEWBOX.w;
  const h = height ?? VIEWBOX.h;

  // --- Colorization helpers ---
  const escapeReg = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const toDataUrl = (svg: string) => {
    const base64 =
      typeof window !== "undefined"
        ? window.btoa(unescape(encodeURIComponent(svg)))
        : Buffer.from(svg, "utf8").toString("base64");
    return `data:image/svg+xml;base64,${base64}`;
  };
  const useColorized = (
    url: string | undefined,
    replacements: ReadonlyArray<{ from: string; to: string }>
  ): string | undefined => {
    const key = React.useMemo(() => {
      return url ? `${url}|${JSON.stringify(replacements)}` : undefined;
    }, [url, replacements]);

    const [dataUrl, setDataUrl] = React.useState<string | undefined>(() => (key ? GLOBAL_COLORIZED_CACHE.get(key) : undefined));

    React.useEffect(() => {
      let cancelled = false;
      if (!url || !key || replacements.length === 0) {
        setDataUrl(url);
        return;
      }
      const cached = GLOBAL_COLORIZED_CACHE.get(key);
      if (cached) {
        setDataUrl(cached);
        return;
      }
      // Deduplicate work across components rendering the same (url+replacements)
      const run = () =>
        fetch(url)
          .then((r) => r.text())
          .then((svg) => {
            let text = svg;
            for (const rep of replacements) {
              const from = rep.from.trim();
              const to = rep.to.trim();
              const re = new RegExp(escapeReg(from), "ig");
              text = text.replace(re, to);
            }
            return toDataUrl(text);
          });

      let promise = GLOBAL_INFLIGHT.get(key);
      if (!promise) {
        promise = run().catch(() => url);
        GLOBAL_INFLIGHT.set(key, promise);
      }

      promise
        .then((encoded) => {
          if (!encoded) return;
          GLOBAL_COLORIZED_CACHE.set(key!, encoded);
          if (!cancelled) setDataUrl(encoded);
        })
        .finally(() => {
          // Clean up in-flight once finished
          GLOBAL_INFLIGHT.delete(key!);
        });
      return () => {
        cancelled = true;
      };
    }, [url, key, replacements]);

    return dataUrl ?? url;
  };

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

  // Apply color replacements:
  // - Face and Clothing_1: replace #e8bda7 (skin) with cfg.skinColor
  // - Body: replace #c2272d (clothing color) with cfg.bodyColor
  const faceReps = React.useMemo(
    () => (cfg.skinColor ? ([{ from: "#e8bda7", to: cfg.skinColor }] as const) : ([] as const)),
    [cfg.skinColor]
  );
  const cloth1Reps = React.useMemo(
    () => (cfg.skinColor ? ([{ from: "#e8bda7", to: cfg.skinColor }] as const) : ([] as const)),
    [cfg.skinColor]
  );
  const bodyReps = React.useMemo(
    () => (cfg.bodyColor ? ([{ from: "#c2272d", to: cfg.bodyColor }] as const) : ([] as const)),
    [cfg.bodyColor]
  );
  const hairReps = React.useMemo(
    () => (cfg.hairColor ? ([{ from: "#694118", to: cfg.hairColor }] as const) : ([] as const)),
    [cfg.hairColor]
  );
  const faceUrl = useColorized(urls.face, faceReps);
  const clothing1Url = useColorized(urls.clothing1, cloth1Reps);
  const bodyColUrl = useColorized(urls.body, bodyReps);
  const hair0Url = useColorized(urls.hair0, hairReps);
  const hair1Url = useColorized(urls.hair1, hairReps);

  // Layer order per spec (0..14):
  // 0 Background, 1 Hair_0, 2 Face, 3 Body, 4 Clothing_0, 5 Face texture, 6 Center, 7 Right, 8 Left, 9 Clothing_1, 10 Eyes, 11 Nose, 12 Mouth, 13 Glasses, 14 Hair_1
  const layers: (string | undefined)[] = [
    undefined, // background handled separately
    hair0Url,
    faceUrl,
    bodyColUrl,
    urls.clothing0,
    urls.faceTexture,
    urls.centerClothing,
    urls.rightClothing,
    urls.leftClothing,
    clothing1Url,
    urls.eyes,
    urls.nose,
    urls.mouth,
    urls.glasses,
    hair1Url,
  ];

  // Note on colors: background is supported. Body/skin recoloring is not applied yet because SVGs contain internal styles.
  // If needed, we can enhance later by inlining and overriding fills.

  const cls = ['avatar', className].filter(Boolean).join(' ');

  const par = cover ? 'xMidYMid slice' : 'xMidYMid meet';
  const BLEED = 1; // small bleed to avoid subpixel gaps
  const imgX = -BLEED / 2;
  const imgY = -BLEED / 2;
  const imgW = VIEWBOX.w + BLEED;
  const imgH = VIEWBOX.h + BLEED;

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
      width={w}
      height={h}
      preserveAspectRatio={par}
      className={cls}
      style={{ display: 'block', ...style }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background color */}
      {!hideBackground && (
        <rect
          x={imgX}
          y={imgY}
          width={imgW}
          height={imgH}
          fill={cfg.bgColor || "transparent"}
          shapeRendering="crispEdges"
        />
      )}

      {/* Stack all layer images */}
      {layers.map((href, idx) =>
        href ? (
          <image
            key={idx}
            href={href}
            xlinkHref={href as any}
            x={imgX}
            y={imgY}
            width={imgW}
            height={imgH}
            preserveAspectRatio={par}
          />
        ) : null
      )}
    </svg>
  );
}

export default Avatar;
