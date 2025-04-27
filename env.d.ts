/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_CLAUDE_API_KEY: string;
  // Add any other PUBLIC_ variables here later
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
