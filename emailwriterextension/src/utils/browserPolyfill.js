/**
 * Cross-browser extension API abstraction layer.
 * Provides unified Promise-based APIs compatible across Chrome, Firefox, Edge, and Safari.
 */

// Fallback to standard browser or chrome namespace
const globalBrowser = typeof globalThis.browser !== 'undefined' 
    ? globalThis.browser 
    : typeof chrome !== 'undefined' 
        ? chrome 
        : null;

class BrowserAdapter {
    constructor() {
        this.browser = globalBrowser;
        this.isFirefox = typeof navigator !== 'undefined' && navigator.userAgent.includes('Firefox');
        this.isSafari = typeof navigator !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        this.isEdge = typeof navigator !== 'undefined' && navigator.userAgent.includes('Edg');
        this.isChrome = !this.isFirefox && !this.isSafari && !this.isEdge;
    }

    /**
     * Retrieves stored items from local extension storage.
     * @param {string|string[]|Object} keys Keys to retrieve
     * @returns {Promise<Object>} Stored items
     */
    async getStorage(keys) {
        if (!this.browser || !this.browser.storage) {
            return Promise.resolve({});
        }

        return new Promise((resolve, reject) => {
            if (this.browser.storage.local.get.length === 1) {
                // Promise-based (Firefox / Manifest V3)
                this.browser.storage.local.get(keys).then(resolve).catch(reject);
            } else {
                // Callback-based (Chrome Manifest V2 / Legacy)
                this.browser.storage.local.get(keys, (items) => {
                    if (this.browser.runtime.lastError) {
                        return reject(this.browser.runtime.lastError);
                    }
                    resolve(items);
                });
            }
        });
    }

    /**
     * Persists items into local extension storage.
     * @param {Object} items Key-value pairs to store
     * @returns {Promise<void>}
     */
    async setStorage(items) {
        if (!this.browser || !this.browser.storage) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            if (this.browser.storage.local.set.length === 1) {
                this.browser.storage.local.set(items).then(resolve).catch(reject);
            } else {
                this.browser.storage.local.set(items, () => {
                    if (this.browser.runtime.lastError) {
                        return reject(this.browser.runtime.lastError);
                    }
                    resolve();
                });
            }
        });
    }

    /**
     * Sends a message to the background service worker / background script.
     * @param {Object} message Payload to send
     * @returns {Promise<any>}
     */
    async sendMessage(message) {
        if (!this.browser || !this.browser.runtime) {
            return Promise.reject(new Error('Extension runtime unavailable'));
        }

        return new Promise((resolve, reject) => {
            try {
                this.browser.runtime.sendMessage(message, (response) => {
                    if (this.browser.runtime.lastError) {
                        return reject(this.browser.runtime.lastError);
                    }
                    resolve(response);
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Injects a content script into the specified tab.
     * @param {number} tabId Target tab ID
     * @param {string[]} files File paths to inject
     * @returns {Promise<void>}
     */
    async injectScript(tabId, files) {
        if (this.browser.scripting && this.browser.scripting.executeScript) {
            return this.browser.scripting.executeScript({
                target: { tabId },
                files: files
            });
        } else if (this.browser.tabs && this.browser.tabs.executeScript) {
            return Promise.all(
                files.map(file => new Promise((resolve, reject) => {
                    this.browser.tabs.executeScript(tabId, { file }, () => {
                        if (this.browser.runtime.lastError) return reject(this.browser.runtime.lastError);
                        resolve();
                    });
                }))
            );
        }
        return Promise.reject(new Error('No script injection API available'));
    }

    /**
     * Returns metadata regarding the current browser environment.
     */
    getBrowserInfo() {
        return {
            name: this.isFirefox ? 'Firefox' : this.isSafari ? 'Safari' : this.isEdge ? 'Edge' : 'Chrome',
            isManifestV3: this.browser && this.browser.runtime && this.browser.runtime.getManifest().manifest_version === 3,
            version: this.browser && this.browser.runtime ? this.browser.runtime.getManifest().version : '1.0.0'
        };
    }
}

export const browserAdapter = new BrowserAdapter();
export default browserAdapter;
