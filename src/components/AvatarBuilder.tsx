import React from 'react';
import Avatar from './Avatar';
import { buildAvatarString, AvatarConfig } from '../lib/avatar';
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
} from '../lib/assetContexts';
import './AvatarBuilder.css';

type Tab = 'Face' | 'Hair' | 'Clothing' | 'Details' | 'Background';

const SKIN_COLORS = ['#f3d8c9', '#e8bda7', '#d9a98e', '#c7906f', '#a66a47', '#7f4e2f'];
const CLOTH_COLORS = ['#c2272d', '#3366cc', '#22aa99', '#ff9900', '#8e44ad', '#2c3e50'];
const HAIR_COLORS = ['#694118', '#3c2415', '#a9744f', '#111111', '#6b8e23', '#9b59b6'];
const BG_COLORS = ['#ffffff', '#f4d', '#ffe680', '#d0f0c0', '#d9e8ff', '#f2f2f2'];

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
const clothingOptions = extractNumbers(
  clothing0Ctx.keys().concat(clothing1Ctx.keys()),
  /Clothing_(\d+)_\d\.svg/
);
const faceTextureOptions = extractNumbers(faceTextureCtx.keys(), /FaceTexture_(\d+)\.svg/);
const centerClothingOptions = extractNumbers(centerClothingCtx.keys(), /CenterClothing_(\d+)\.svg/);
const rightClothingOptions = extractNumbers(rightClothingCtx.keys(), /RightClothing_(\d+)\.svg/);
const leftClothingOptions = extractNumbers(leftClothingCtx.keys(), /LeftClothing_(\d+)\.svg/);
const glassesOptions = extractNumbers(glassesCtx.keys(), /Glasses_(\d+)\.svg/);

function Swatch({ color, selected, onClick }: { color: string; selected?: boolean; onClick: () => void }) {
  return (
    <button
      className={`swatch ${selected ? 'selected' : ''}`}
      style={{ background: color }}
      onClick={onClick}
      aria-label={`Color ${color}`}
    />
  );
}

function Tile({ children, selected, onClick }: { children: React.ReactNode; selected?: boolean; onClick: () => void }) {
  return (
    <button className={`tile ${selected ? 'selected' : ''}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default function AvatarBuilder() {
  const [tab, setTab] = React.useState<Tab>('Face');
  const [name, setName] = React.useState('');

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
    // For now just log; consumer can persist externally
    // eslint-disable-next-line no-console
    console.log('Saved avatar:', { name, string: s, config: cfg });
    alert('Saved!\n' + s);
  };

  // Helpers to set/toggle numeric options
  const setNumeric = <K extends keyof AvatarConfig>(key: K, value: number) =>
    setCfg((x) => ({ ...x, [key]: value } as AvatarConfig));
  const toggleNumeric = <K extends keyof AvatarConfig>(key: K, value: number) =>
    setCfg((x) => ({ ...x, [key]: ((x[key] as unknown as number) === value ? 0 : value) } as AvatarConfig));

  return (
    <div className="builder-root">
      <div className="builder-hero" style={{ background: '#f43ca0' }}>
        <div className="builder-title">Your Profile</div>
        <div className="builder-preview">
          <Avatar config={cfg} width={170} height={221} />
        </div>
      </div>

      <div className="builder-body">
        <input
          className="builder-name"
          placeholder="Your Display Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="builder-tabs">
          {(['Face', 'Hair', 'Clothing', 'Details', 'Background'] as Tab[]).map((t) => (
            <button
              key={t}
              className={`tab ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'Face' && (
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
            <div className="tiles-grid">
              {faceOptions.map((n) => (
                <Tile key={n} selected={cfg.faceType === n} onClick={() => setCfg((x) => ({ ...x, faceType: n }))}>
                  <Avatar config={{ ...cfg, faceType: n }} width="100%" height="100%" />
                </Tile>
              ))}
            </div>
          </div>
        )}

        {tab === 'Hair' && (
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
            <div className="tiles-grid">
              {/* None / Bald option */}
              <Tile selected={!cfg.hairType} onClick={() => setNumeric('hairType', 0)}>
                <Avatar config={{ ...cfg, hairType: 0 }} width="100%" height="100%" />
              </Tile>
              {hairOptions.map((n) => (
                <Tile key={n} selected={cfg.hairType === n} onClick={() => toggleNumeric('hairType', n)}>
                  <Avatar config={{ ...cfg, hairType: n }} width="100%" height="100%" />
                </Tile>
              ))}
            </div>
          </div>
        )}

        {tab === 'Clothing' && (
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
            <div className="tiles-grid">
              {clothingOptions.map((n) => (
                <Tile
                  key={n}
                  selected={cfg.clothingType === n}
                  onClick={() => setCfg((x) => ({ ...x, clothingType: n }))}
                >
                  <Avatar config={{ ...cfg, clothingType: n }} width="100%" height="100%" />
                </Tile>
              ))}
            </div>
          </div>
        )}

        {tab === 'Details' && (
          <div className="tiles-grid">
            {[
              ...faceTextureOptions.map((n) => ({ type: 'faceTexture' as const, n })),
              ...glassesOptions.map((n) => ({ type: 'glasses' as const, n })),
              ...centerClothingOptions.map((n) => ({ type: 'centerClothing' as const, n })),
              ...rightClothingOptions.map((n) => ({ type: 'rightClothing' as const, n })),
              ...leftClothingOptions.map((n) => ({ type: 'leftClothing' as const, n })),
            ].map((it) => {
              const selected =
                (it.type === 'faceTexture' && cfg.faceTexture === it.n) ||
                (it.type === 'glasses' && cfg.glasses === it.n) ||
                (it.type === 'centerClothing' && cfg.centerClothing === it.n) ||
                (it.type === 'rightClothing' && cfg.rightClothing === it.n) ||
                (it.type === 'leftClothing' && cfg.leftClothing === it.n);

              const onClick = () => {
                if (it.type === 'faceTexture') toggleNumeric('faceTexture', it.n);
                if (it.type === 'glasses') toggleNumeric('glasses', it.n);
                if (it.type === 'centerClothing') toggleNumeric('centerClothing', it.n);
                if (it.type === 'rightClothing') toggleNumeric('rightClothing', it.n);
                if (it.type === 'leftClothing') toggleNumeric('leftClothing', it.n);
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
              if (it.type === 'faceTexture') previewCfg.faceTexture = it.n;
              if (it.type === 'glasses') previewCfg.glasses = it.n;
              if (it.type === 'centerClothing') previewCfg.centerClothing = it.n;
              if (it.type === 'rightClothing') previewCfg.rightClothing = it.n;
              if (it.type === 'leftClothing') previewCfg.leftClothing = it.n;

              return (
                <Tile key={`${it.type}-${it.n}`} selected={selected} onClick={onClick}>
                  <Avatar config={previewCfg} width="100%" height="100%" />
                </Tile>
              );
            })}
          </div>
        )}

        {tab === 'Background' && (
          <div className="tiles-grid">
            {BG_COLORS.map((c) => (
              <Tile
                key={c}
                selected={cfg.bgColor?.toLowerCase() === c.toLowerCase()}
                onClick={() => setCfg((x) => ({ ...x, bgColor: c }))}
              >
                <Avatar config={{ ...cfg, bgColor: c }} width="100%" height="100%" />
              </Tile>
            ))}
          </div>
        )}

        <div className="save-row">
          <button className="save-btn" onClick={onSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
