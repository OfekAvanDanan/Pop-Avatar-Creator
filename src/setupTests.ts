// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Provide a Jest stub for Webpack's require.context so tests don't crash
// This does not actually load assets; components should handle missing layers gracefully.
try {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (require as any).context = (base: string, deep?: boolean, pattern?: RegExp) => {
    const fn: any = (key: string) => '';
    fn.keys = () => [] as string[];
    fn.resolve = (key: string) => key;
    fn.id = base;
    return fn;
  };
} catch {}
