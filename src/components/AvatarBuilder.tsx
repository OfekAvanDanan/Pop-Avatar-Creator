import React from "react";
import Avatar from "./Avatar";
import { buildAvatarString, AvatarConfig } from "../lib/avatar";
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
import "./AvatarBuilder.css";
import ColumnPager from "./ColumnPager";
import Tabs from "./common/Tabs";
import Swatch from "./common/Swatch";
import Tile from "./common/Tile";
import { SKIN_COLORS, CLOTH_COLORS, HAIR_COLORS, BG_COLORS } from "../styles/palette";
import ofekLogo from "../Assets/logo/Logo.svg";

type Tab = "Face" | "Hair" | "Clothing" | "Details" | "Background";

// Palettes are imported from styles/palette

function extractNumbers(keys: string[], re: RegExp, group = 1): number[] {
  const set = new Set<number>();
  for (const k of keys) {
    const m = k.match(re);
    if (m) {
      set.add(Number(m[group]));
    }
  }
  return Array.from(set).sort((a, b) => a - b);
}

const faceOptions = extractNumbers(faceCtx.keys(), /Face_(\d+)\.svg/);
const hairOptions = extractNumbers(hair0Ctx.keys().concat(hair1Ctx.keys()), /Hair_(\d{3})_\d\.svg/);
const clothingOptions = extractNumbers(clothing0Ctx.keys().concat(clothing1Ctx.keys()), /Clothing_(\d+)_\d\.svg/);
const faceTextureOptions = extractNumbers(faceTextureCtx.keys(), /FaceTexture_(\d+)\.svg/);
const centerClothingOptions = extractNumbers(centerClothingCtx.keys(), /CenterClothing_(\d+)\.svg/);
const rightClothingOptions = extractNumbers(rightClothingCtx.keys(), /RightClothing_(\d+)\.svg/);
const leftClothingOptions = extractNumbers(leftClothingCtx.keys(), /LeftClothing_(\d+)\.svg/);
const glassesOptions = extractNumbers(glassesCtx.keys(), /Glasses_(\d+)\.svg/);

export default function AvatarBuilder() {
  const [tab, setTab] = React.useState<Tab>("Face");

  const [cfg, setCfg] = React.useState<AvatarConfig>({
    bgColor: BG_COLORS[0],
    bodyColor: CLOTH_COLORS[0],
    skinColor: SKIN_COLORS[1],
    hairColor: HAIR_COLORS[0],
    faceType: faceOptions[0] ?? 1,
    hairType: hairOptions[0] ?? 1,
    clothingType: clothingOptions[0] ?? 1,
    glasses: 0,
  });

  const onSave = () => {
    const s = buildAvatarString(cfg);
    // Build a ready-to-paste variable snippet
    const snippet = `const AVATAR_STRING = "${s}";`;
    // Expose on window for quick access during the session
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).AVATAR_STRING = s;
    } catch {}
    // Persist a copy (optional), and copy to clipboard
    try {
      localStorage.setItem("AVATAR_STRING", s);
    } catch {}
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(snippet).then(
        () => {
          // eslint-disable-next-line no-console
          console.log("Saved & copied to clipboard:", snippet);
          alert("Saved and copied to clipboard!\n" + snippet);
        },
        () => {
          // eslint-disable-next-line no-console
          console.log("Saved (clipboard unavailable):", snippet);
          alert("Saved! (Could not copy automatically)\n" + snippet);
        }
      );
    } else {
      // eslint-disable-next-line no-console
      console.log("Saved (no clipboard API):", snippet);
      alert("Saved! (Clipboard API unavailable)\n" + snippet);
    }
  };

  // Helpers to set/toggle numeric options
  const setNumeric = <K extends keyof AvatarConfig>(key: K, value: number) =>
    setCfg((x) => ({ ...x, [key]: value } as AvatarConfig));
  const toggleNumeric = <K extends keyof AvatarConfig>(key: K, value: number) =>
    setCfg((x) => ({ ...x, [key]: (x[key] as unknown as number) === value ? 0 : value } as AvatarConfig));

  return (
    <div className="builder-root">
      <div
        className="builder-hero"
        style={{ ["--hero-bg" as unknown as string]: cfg.bgColor || "#E72787" } as React.CSSProperties}
      >
        <div className="builder-title">
          <img className="ofek-logo" src={ofekLogo} alt="Ofek Logo" />
          <h1 className="title-text"> Pop Avatar Creator</h1>
        </div>
        <div className="builder-preview">
          <Avatar config={cfg} hideBackground cover={true} width="100%" height="100%" />
        </div>
      </div>

      <div className="builder-body">
        <Tabs
          items={[
            { key: "Face", label: "Face" },
            { key: "Hair", label: "Hair" },
            { key: "Clothing", label: "Clothing" },
            { key: "Details", label: "Details" },
            { key: "Background", label: "Background" },
          ]}
          activeKey={tab}
          onChange={(k) => setTab(k as Tab)}
        />
        <div className="container-tilesnswatches">
          {tab === "Face" && (
            <div>
              <div className="swatch-row">
                {SKIN_COLORS.map((c) => (
                  <Swatch
                    key={c}
                    color={c}
                    selected={cfg.skinColor?.toLowerCase() === c.toLowerCase()}
                    onClick={() => setCfg((x) => ({ ...x, skinColor: c }))}
                  />
                ))}
              </div>
              <ColumnPager>
                {faceOptions.map((n) => (
                  <Tile
                    key={`face-${n}`}
                    selected={cfg.faceType === n}
                    onClick={() => setCfg((x) => ({ ...x, faceType: n }))}
                  >
                    <Avatar config={{ ...cfg, faceType: n }} width="100%" height="100%" />
                  </Tile>
                ))}
              </ColumnPager>
            </div>
          )}

          {tab === "Hair" && (
            <div>
              <div className="swatch-row">
                {HAIR_COLORS.map((c) => (
                  <Swatch
                    key={c}
                    color={c}
                    selected={cfg.hairColor?.toLowerCase() === c.toLowerCase()}
                    onClick={() => setCfg((x) => ({ ...x, hairColor: c }))}
                  />
                ))}
              </div>
              {(() => {
                const group0 = hairOptions.filter((n) => n < 100);
                const group1 = hairOptions.filter((n) => n >= 100);
                const zipped: number[] = [];
                const m = Math.max(group0.length, group1.length);
                for (let i = 0; i < m; i++) {
                  if (i < group0.length) zipped.push(group0[i]); // first row (0xx)
                  if (i < group1.length) zipped.push(group1[i]); // second row (1xx)
                }
                return (
                  <ColumnPager>
                    {zipped.map((n) => (
                      <Tile
                        key={`hair-${n}`}
                        selected={cfg.hairType === n}
                        onClick={() => toggleNumeric("hairType", n)}
                      >
                        <Avatar config={{ ...cfg, hairType: n }} width="100%" height="100%" />
                      </Tile>
                    ))}
                    {/* None / Bald option moved to end */}
                    <Tile key="hair-0" selected={!cfg.hairType} onClick={() => setNumeric("hairType", 0)}>
                      <Avatar config={{ ...cfg, hairType: 0 }} width="100%" height="100%" />
                    </Tile>
                  </ColumnPager>
                );
              })()}
            </div>
          )}

          {tab === "Clothing" && (
            <div>
              <div className="swatch-row">
                {CLOTH_COLORS.map((c) => (
                  <Swatch
                    key={c}
                    color={c}
                    selected={cfg.bodyColor?.toLowerCase() === c.toLowerCase()}
                    onClick={() => setCfg((x) => ({ ...x, bodyColor: c }))}
                  />
                ))}
              </div>
              <ColumnPager>
                {clothingOptions.map((n) => (
                  <Tile
                    key={`cloth-${n}`}
                    selected={cfg.clothingType === n}
                    onClick={() => setCfg((x) => ({ ...x, clothingType: n }))}
                  >
                    <Avatar config={{ ...cfg, clothingType: n }} width="100%" height="100%" />
                  </Tile>
                ))}
              </ColumnPager>
            </div>
          )}

          {tab === "Details" && (
            <ColumnPager>
              {[
                ...faceTextureOptions.map((n) => ({ type: "faceTexture" as const, n })),
                ...glassesOptions.map((n) => ({ type: "glasses" as const, n })),
                ...centerClothingOptions.map((n) => ({ type: "centerClothing" as const, n })),
                ...rightClothingOptions.map((n) => ({ type: "rightClothing" as const, n })),
                ...leftClothingOptions.map((n) => ({ type: "leftClothing" as const, n })),
              ].map((it) => {
                const selected =
                  (it.type === "faceTexture" && cfg.faceTexture === it.n) ||
                  (it.type === "glasses" && cfg.glasses === it.n) ||
                  (it.type === "centerClothing" && cfg.centerClothing === it.n) ||
                  (it.type === "rightClothing" && cfg.rightClothing === it.n) ||
                  (it.type === "leftClothing" && cfg.leftClothing === it.n);

                const onClick = () => {
                  if (it.type === "faceTexture") toggleNumeric("faceTexture", it.n);
                  if (it.type === "glasses") toggleNumeric("glasses", it.n);
                  if (it.type === "centerClothing") toggleNumeric("centerClothing", it.n);
                  if (it.type === "rightClothing") toggleNumeric("rightClothing", it.n);
                  if (it.type === "leftClothing") toggleNumeric("leftClothing", it.n);
                };

                // For preview tiles in Details: show only the specific item, others reset to 0
                const previewCfg: AvatarConfig = {
                  ...cfg,
                  faceTexture: 0,
                  glasses: 0,
                  centerClothing: 0,
                  rightClothing: 0,
                  leftClothing: 0,
                };
                if (it.type === "faceTexture") previewCfg.faceTexture = it.n;
                if (it.type === "glasses") previewCfg.glasses = it.n;
                if (it.type === "centerClothing") previewCfg.centerClothing = it.n;
                if (it.type === "rightClothing") previewCfg.rightClothing = it.n;
                if (it.type === "leftClothing") previewCfg.leftClothing = it.n;

                return (
                  <Tile key={`${it.type}-${it.n}`} selected={selected} onClick={onClick}>
                    <Avatar config={previewCfg} width="100%" height="100%" />
                  </Tile>
                );
              })}
            </ColumnPager>
          )}

          {tab === "Background" && (
            <ColumnPager>
              {BG_COLORS.map((c) => (
                <Tile
                  key={`bg-${c}`}
                  selected={cfg.bgColor?.toLowerCase() === c.toLowerCase()}
                  onClick={() => setCfg((x) => ({ ...x, bgColor: c }))}
                >
                  <Avatar config={{ ...cfg, bgColor: c }} width="100%" height="100%" />
                </Tile>
              ))}
            </ColumnPager>
          )}
        </div>
        <div className="save-row">
          <button className="save-btn" onClick={onSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
