# 🌐 Cross-Browser Extension Architecture & Compatibility Guide

This guide details the architectural decisions and build mechanisms that allow **MailGenie** to run seamlessly across Chrome, Mozilla Firefox, Microsoft Edge, and Apple Safari.

---

## 1. Architectural Strategy

Extensions historically diverged across vendor-specific APIs (`chrome.*` vs `browser.*` and Manifest V2 vs Manifest V3). MailGenie resolves this with an abstraction layer:

```mermaid
graph TD
    UI[Extension UI / Content Script] --> Adapter[BrowserAdapter (browserPolyfill.js)]
    Adapter -->|Chrome / Edge| ChromeAPI[Chrome MV3 Service Worker API]
    Adapter -->|Firefox| FirefoxAPI[WebExtension API (browser.*)]
    Adapter -->|Safari| SafariAPI[WebExtension API (Safari MV3)]
```

### Core Compatibility Matrix

| Browser | Manifest Version | Storage API | Messaging | Background Execution |
| :--- | :--- | :--- | :--- | :--- |
| **Google Chrome** | Manifest V3 | `chrome.storage.local` | `chrome.runtime.sendMessage` | Service Worker (`background.js`) |
| **Mozilla Firefox** | Manifest V2 / V3 | `browser.storage.local` | `browser.runtime.sendMessage` | Background Event Page / Worker |
| **Microsoft Edge** | Manifest V3 | `chrome.storage.local` | `chrome.runtime.sendMessage` | Service Worker |
| **Apple Safari** | Manifest V3 | `browser.storage.local` | `browser.runtime.sendMessage` | Service Worker |

---

## 2. API Normalization via `BrowserAdapter`

All extension modules import `browserAdapter` rather than directly referencing `window.chrome` or `window.browser`.

### Example: Unified Storage

```javascript
import { browserAdapter } from './utils/browserPolyfill.js';

// Saving preferences
await browserAdapter.setStorage({
    mailgenie_tone: 'professional',
    mailgenie_custom_prompt: 'Please draft a concise executive summary.'
});

// Retrieving preferences
const { mailgenie_tone } = await browserAdapter.getStorage('mailgenie_tone');
```

### Example: Cross-Browser Background Messaging

```javascript
import { ExtensionMessenger } from './utils/messaging.js';

try {
    const { reply, executionTimeMs } = await ExtensionMessenger.requestEmailGeneration({
        prompt: 'Follow up on invoice',
        tone: 'professional'
    });
    console.log(`Generated in ${executionTimeMs}ms:`, reply);
} catch (error) {
    console.error('Failed to communicate with service worker:', error);
}
```

---

## 3. Multi-Target Build Pipeline

The extension build script compiles distinct packages for each browser distribution:

```bash
# Build for Chrome Web Store
npm run build:chrome

# Build for Firefox Add-ons (AMO)
npm run build:firefox

# Build for Edge Add-ons
npm run build:edge
```

---

## 4. Known Cross-Browser Edge Cases & Mitigations

### Service Worker Lifecycles (Chrome MV3 vs Firefox)
In Chrome Manifest V3, background service workers are ephemeral and terminate after 30 seconds of inactivity. In contrast, Firefox supports non-persistent event background pages.

**Mitigation:** `BrowserAdapter` utilizes persistent alarm listeners (`chrome.alarms` / `browser.alarms`) to retain WebSocket heartbeat pings when long-running email generations occur.

### DOM Content Script Isolation (Gmail)
Different browser engines handle content script CSS injection uniquely:
- Chromium enforces strict isolation on shadow DOM roots.
- Firefox Gecko engine permits direct stylesheet insertion into the document header.

**Mitigation:** All MailGenie injected UI components encapsulate their styling within a custom Shadow Root (`attachShadow({ mode: 'open' })`) with normalized reset stylesheets to ensure identical layout rendering across Gecko and Blink engines.

### Storage Quota Discrepancies
- Chrome allows up to 10MB in `chrome.storage.local`.
- Firefox permits unlimited storage with the `unlimitedStorage` permission.

**Mitigation:** The `BrowserAdapter` implements an LRU cache eviction strategy for cached email draft templates to prevent exceeding quota thresholds on Chromium-based browsers.
