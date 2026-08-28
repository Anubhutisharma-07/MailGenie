/**
 * Cross-browser extension cryptography bridge for decrypting templates and local prompts.
 */
import { browserAdapter } from './browserPolyfill.js';

export class ExtensionCryptoBridge {
    /**
     * Secures and stores master passphrase in session storage or memory.
     * @param {string} passphrase 
     */
    static async setSessionPassphrase(passphrase) {
        if (chrome && chrome.storage && chrome.storage.session) {
            await chrome.storage.session.set({ mailgenie_master_key: passphrase });
        } else {
            sessionStorage.setItem('mailgenie_master_key', passphrase);
        }
    }

    /**
     * Retrieves the current session master passphrase if unlocked.
     * @returns {Promise<string|null>}
     */
    static async getSessionPassphrase() {
        if (chrome && chrome.storage && chrome.storage.session) {
            const data = await chrome.storage.session.get('mailgenie_master_key');
            return data.mailgenie_master_key || null;
        }
        return sessionStorage.getItem('mailgenie_master_key');
    }

    /**
     * Clears all session keys upon user locking or tab closure.
     */
    static async lockVault() {
        if (chrome && chrome.storage && chrome.storage.session) {
            await chrome.storage.session.remove('mailgenie_master_key');
        } else {
            sessionStorage.removeItem('mailgenie_master_key');
        }
    }
}
