export type PermissionType = 
  | "activeTab"
  | "alarms"
  | "background"
  | "bookmarks"
  | "browsingData"
  | "certificateProvider"
  | "clipboardRead"
  | "clipboardWrite"
  | "contentSettings"
  | "contentMenus"
  | "cookies"
  | "debugger"
  | "declarativeContent"
  | "declarativeNetRequestWithHostAccess"
  | "declarativeNetRequestFeedback"
  | "declarativeWebRequest"
  | "desktopCapture"
  | "documentScan"
  | "experimental"
  | "fileBrowserHandler"
  | "fileSystemProvider"
  | "fontSetting"
  | "gcm"
  | "geolocation"
  | "history"
  | "identify"
  | "idle"
  | "loginState" 
  | "management"
  | "nativeMessaging"
  | "offscreen"
  | "pageCapture"
  | "platformKeys"
  | "power"
  | "printerProvider"
  | "printing"
  | "printingMetrics"
  | "privacy"
  | "proxy"
  | "scripting"
  | "search"
  | "sessions"
  /** @link [storage reference](https://developer.chrome.com/docs/extensions/reference/storage) */
  | "storage"
  | "system.cpu"
  | "system.display"
  | "system.memory"
  | "system.storage"
  | "tabCapture"
  | "tabGroups"
  | "tabs"
  | "topSites"
  | "tts"
  | "ttsEngine"
  | "unlimitedStorage"
  | "vpnProvider"
  | "wallpaper"
  | "webNavigation"
  | "webRequest"
  | "webRequestBlocking"

export interface IContentScript {
  matches: string[];
  js?: string[];
  css?: string[];

  /** @link [RunAt](https://developer.chrome.com/docs/extensions/reference/extensionTypes/#type-RunAt) */
  run_at?: "document_idle" | "document_start" | "document_end";
  match_about_blank?: boolean;
  match_origin_as_fallback?: boolean;
  world?: chrome.scripting.ExecutionWorld
}

interface IAction {
  default_icon?: Record<string, string>,
  default_title?: string,
  defailt_popup?: string
}

type pathString = string;

export interface IExtensionManifest {
  name: string,
  version: string,
  manifest_version: 3 | 2,
  // Recommended
  action?: IAction,
  default_locale?: string,
  description?: string,
  icons?: Record<"16" | "32" | "48" | "128", pathString>,
  
  // Optional
  author?: string,  
  automation?: {
    desktop: boolean,
    interact: boolean,
    /** array of string URLs */
    matches: string[]
  },
  background?: {
    service_worker: string,
    type?: "module"
  } | {
    scripts: string[],
    persistent?: boolean
  },
  chrome_settings_overrides?: {
    homepage: string,
    search_provider: Record<string, any>,
    startup_pages: Record<string, any>
  },
  chrome_url_overrides?: any,
  commands?: Record<string, {suggested_key: Record<"default" | "mac" | "chromeos" | "linux", string>, description?: string}>,
  content_scripts?: IContentScript[],
  content_security_policy?: {
    extension_pages?: string,
    sandbox?: string
  },
  cross_origin_embedder_policy?: any,
  cross_origin_opener_policy?: any,
  declarative_net_request?: any,
  devtools_page?: string,
  event_rules?: any[],
  export?: any,
  externally_connectable?: any,
  file_browser_handlers?: any[],
  file_system_provider_capabilities?: any,
  homepage_url?: string,
  host_permissions?: string[],
  import?: [any],
  incognito?: "spanning" | "split" | "not_allowed",
  input_components?: [any],
  key?: string,
  minimum_chrome_version?: string,
  oauth2?: any,
  omnibox?: any,
  optional_host_permissions?: string[],
  optional_permissions?: PermissionType[],
  options_page?: string,
  options_ui?: any,
  permissions?: PermissionType[],
  requirements?: any,
  sandbox?: any,
  short_name?: "Short Name",
  storage?: any,
  tts_engine?: any,
  update_url?: string,
  version_name?: "1.0 beta",
  web_accessible_resources?: string
}