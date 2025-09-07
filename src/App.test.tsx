import React from 'react';
import { render, screen } from '@testing-library/react';
// Mock Avatar to avoid require.context in Jest
jest.mock('./components/Avatar', () => () => null);
jest.mock('./lib/assetContexts', () => ({
  faceCtx: { keys: () => [], resolve: (k: string) => k, id: 'face', default: () => '' },
  hair0Ctx: { keys: () => [], resolve: (k: string) => k, id: 'h0', default: () => '' },
  hair1Ctx: { keys: () => [], resolve: (k: string) => k, id: 'h1', default: () => '' },
  clothing0Ctx: { keys: () => [], resolve: (k: string) => k, id: 'c0', default: () => '' },
  clothing1Ctx: { keys: () => [], resolve: (k: string) => k, id: 'c1', default: () => '' },
  faceTextureCtx: { keys: () => [], resolve: (k: string) => k, id: 'ft', default: () => '' },
  centerClothingCtx: { keys: () => [], resolve: (k: string) => k, id: 'cc', default: () => '' },
  rightClothingCtx: { keys: () => [], resolve: (k: string) => k, id: 'rc', default: () => '' },
  leftClothingCtx: { keys: () => [], resolve: (k: string) => k, id: 'lc', default: () => '' },
  glassesCtx: { keys: () => [], resolve: (k: string) => k, id: 'g', default: () => '' },
}));
import App from './App';

test('renders builder title', () => {
  render(<App />);
  expect(screen.getByText(/Your Profile/i)).toBeInTheDocument();
});
