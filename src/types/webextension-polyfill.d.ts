declare module "webextension-polyfill" {
  export type RunAt = "document_start" | "document_end" | "document_idle";

  export type ContentScriptRegistration = {
    id: string;
    matches: string[];
    excludeMatches?: string[] | undefined;
    js: string[];
    runAt?: RunAt | undefined;
  };

  export type RegisteredContentScript = {
    id: string;
  };

  export type Permissions = {
    origins?: string[] | undefined;
    permissions?: string[] | undefined;
  };

  export type StorageItems = Record<string, unknown>;

  export type StorageArea = {
    get: (keys?: string | string[] | null) => Promise<StorageItems>;
    set: (items: StorageItems) => Promise<void>;
  };

  export type Runtime = {
    sendMessage: (message: unknown) => Promise<unknown>;
    openOptionsPage: () => Promise<void>;
    onMessage: {
      addListener: (listener: (message: unknown) => unknown | Promise<unknown>) => void;
    };
    onInstalled: { addListener: (listener: () => void) => void };
    onStartup: { addListener: (listener: () => void) => void };
  };

  export type PermissionsApi = {
    contains: (permissions: Permissions) => Promise<boolean>;
    request: (permissions: Permissions) => Promise<boolean>;
    remove: (permissions: Permissions) => Promise<boolean>;
  };

  export type ScriptingApi = {
    getRegisteredContentScripts: () => Promise<RegisteredContentScript[]>;
    registerContentScripts: (scripts: ContentScriptRegistration[]) => Promise<void>;
    unregisterContentScripts: (details?: { ids?: string[] }) => Promise<void>;
  };

  const browser: {
    runtime: Runtime;
    storage: { local: StorageArea };
    permissions: PermissionsApi;
    scripting: ScriptingApi;
  };

  export default browser;
}
