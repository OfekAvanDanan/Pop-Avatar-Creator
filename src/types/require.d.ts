// Augment Node's require with Webpack's require.context
declare global {
  interface NodeRequire {
    context(
      directory: string,
      useSubdirectories?: boolean,
      regExp?: RegExp
    ): {
      keys(): string[];
      (id: string): string;
      resolve: (id: string) => string;
      id: string;
    };
  }
}

export {};
