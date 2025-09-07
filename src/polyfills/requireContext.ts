// Ensure require.context exists in non-webpack environments (e.g., Jest)
(() => {
  const F: any = Function.prototype as any;
  if (typeof F.context !== 'function') {
    Object.defineProperty(F, 'context', {
      configurable: true,
      writable: true,
      value: (base: string, _deep?: boolean, _pattern?: RegExp) => {
        const fn: any = (_key: string) => '';
        fn.keys = () => [] as string[];
        fn.resolve = (k: string) => k;
        fn.id = base;
        return fn;
      },
    });
  }
})();

export {};
