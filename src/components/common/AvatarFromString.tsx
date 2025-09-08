import React from 'react';
import Avatar from '../../components/Avatar';

// Simple cross-instance cache keyed by config string + size + cover
// Avoids re-fetching/re-colorizing the same assets for repeated avatars.
// Note: Avatar.tsx already has asset-level caches; this additionally memoizes
// the React element per key to prevent extra React work for identical inputs.
const AVATAR_ELEMENT_CACHE = new Map<string, React.ReactElement>();

export type AvatarFromStringProps = {
  configString: string;
  size?: number | string; // single edge, defaults to 160
  cover?: boolean; // passthrough to Avatar, default true
  className?: string;
  style?: React.CSSProperties;
};

export function useAvatarFromString(
  configString: string,
  size: number | string = 160,
  cover = true,
  className?: string,
  style?: React.CSSProperties
) {
  const key = `${configString}|${String(size)}|${cover}`;
  // Populate cache lazily; element is pure and can be reused safely.
  if (!AVATAR_ELEMENT_CACHE.has(key)) {
    AVATAR_ELEMENT_CACHE.set(
      key,
      <Avatar
        key={key}
        configString={configString}
        width={size}
        height={size}
        cover={cover}
        className={className}
        style={style}
      />
    );
  }
  return AVATAR_ELEMENT_CACHE.get(key)!;
}

export default function AvatarFromString(props: AvatarFromStringProps) {
  const { configString, size = 160, cover = true, className, style } = props;
  const el = useAvatarFromString(configString, size, cover, className, style);
  return el;
}

