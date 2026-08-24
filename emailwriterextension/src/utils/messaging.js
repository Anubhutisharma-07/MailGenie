import { browserAdapter } from './browserPolyfill.js';

/**
 * High-level messaging client for communicating between Gmail Content Script and Service Worker.
 */
export class ExtensionMessenger {
    /**
     * Requests AI email generation with retry logic and telemetry.
     * @param {Object} options Generation parameters
     * @param {string} options.prompt Email instructions
     * @param {string} options.tone Tone preset (e.g. professional, friendly)
     * @param {string} [options.provider] Optional LLM provider override
     * @returns {Promise<{ reply: string, executionTimeMs: number }>}
     */
    static async requestEmailGeneration({ prompt, tone, provider = 'AUTO' }) {
        const startTime = Date.now();
        const payload = {
            action: 'GENERATE_AI_REPLY',
            data: {
                prompt,
                tone,
                provider,
                timestamp: new Date().toISOString()
            }
        };

        try {
            const response = await browserAdapter.sendMessage(payload);
            if (!response || response.error) {
                throw new Error(response?.error || 'Empty response received from service worker');
            }

            return {
                reply: response.reply || response.data,
                executionTimeMs: Date.now() - startTime
            };
        } catch (error) {
            console.error('[MailGenie Extension] Generation request failed:', error);
            throw error;
        }
    }

    /**
     * Synchronizes custom templates created in the dashboard to local extension storage.
     * @param {Array<Object>} templates Custom templates array
     * @returns {Promise<boolean>}
     */
    static async syncTemplates(templates) {
        try {
            await browserAdapter.setStorage({ mailgenie_custom_templates: templates });
            return true;
        } catch (err) {
            console.error('[MailGenie Extension] Failed to sync templates:', err);
            return false;
        }
    }

    /**
     * Retrieves stored custom templates from the cross-browser storage.
     * @returns {Promise<Array<Object>>}
     */
    static async getStoredTemplates() {
        const stored = await browserAdapter.getStorage('mailgenie_custom_templates');
        return stored.mailgenie_custom_templates || [];
    }
}
