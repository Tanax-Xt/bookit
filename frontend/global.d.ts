interface ImportMetaEnv {
  readonly APP_NAME: string;
  readonly APP_VERSION: string;
  readonly VITE_API_URL: string;
  readonly VITE_TELEGRAM_BOT_USERNAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
