// MailGenie: Enterprise Modern Gmail Integration Content Script
console.log("MailGenie Extension - Content Script Loaded v2.0");

// Store undo state per compose container
const composeUndoStateMap = new WeakMap();

// Load stored configurations with defaults, safely checking for API availability
function getSettings() {
    return new Promise((resolve) => {
        const defaults = {
            backendUrl: 'http://localhost:8080',
            provider: 'groq',
            apiKey: '',
            defaultTone: 'professional',
            defaultLanguage: 'English',
            customModel: ''
        };

        if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
            console.warn("MailGenie: chrome.storage.local is not available. Using defaults.");
            resolve(defaults);
            return;
        }

        try {
            chrome.storage.local.get(defaults, (items) => {
                if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.lastError) {
                    console.warn("MailGenie: Error loading settings:", chrome.runtime.lastError.message);
                    resolve(defaults);
                } else {
                    resolve(items || defaults);
                }
            });
        } catch (e) {
            console.error("MailGenie: Exception reading settings from storage:", e);
            resolve(defaults);
        }
    });
}

// Dynamically check the background brightness of Gmail compose to detect dark mode
function detectTheme(element) {
    try {
        let current = element;
        while (current && current !== document.body) {
            const bg = window.getComputedStyle(current).backgroundColor;
            if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
                const rgb = bg.match(/\d+/g);
                if (rgb && rgb.length >= 3) {
                    const r = parseInt(rgb[0]);
                    const g = parseInt(rgb[1]);
                    const b = parseInt(rgb[2]);
                    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                    return brightness < 128 ? 'dark' : 'light';
                }
            }
            current = current.parentElement;
        }
    } catch (e) {
        console.warn("MailGenie: Failed to detect theme", e);
    }
    return 'light';
}

// Global Toast Notification UI
function showToast(message, type = 'info', duration = 3000) {
    let container = document.getElementById('mailgenie-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'mailgenie-toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `mailgenie-toast mailgenie-toast-${type}`;
    
    let icon = '✨';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';
    if (type === 'undo') icon = '↩️';

    toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-msg">${message}</span>`;
    container.appendChild(toast);

    // Trigger frame animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove());
    }, duration);
}

// Create Controls
function createAIButton() {
    const button = document.createElement('button');
    button.className = 'mailgenie-btn mailgenie-btn-primary';
    button.innerHTML = '<span class="mailgenie-btn-icon">✨</span><span class="mailgenie-btn-text">AI Reply</span>';
    button.setAttribute('type', 'button');
    button.setAttribute('title', 'Generate AI Email Reply (MailGenie)');
    return button;
}

function createUndoButton() {
    const button = document.createElement('button');
    button.className = 'mailgenie-btn mailgenie-btn-secondary mailgenie-btn-undo';
    button.innerHTML = '<span class="mailgenie-btn-icon">↩</span><span class="mailgenie-btn-text">Undo</span>';
    button.setAttribute('type', 'button');
    button.setAttribute('title', 'Undo AI generated text insertion');
    button.disabled = true;
    return button;
}

function createCopyButton() {
    const button = document.createElement('button');
    button.className = 'mailgenie-btn mailgenie-btn-icon-only';
    button.innerHTML = '📋';
    button.setAttribute('type', 'button');
    button.setAttribute('title', 'Copy draft to clipboard');
    return button;
}

function createToneSelect(defaultValue) {
    const select = document.createElement('select');
    select.className = 'mailgenie-select mailgenie-tone-select';
    select.title = 'Select reply tone';
    
    const tones = [
        { value: 'professional', label: '👔 Professional' },
        { value: 'casual', label: '☕ Casual' },
        { value: 'friendly', label: '😊 Friendly' },
        { value: 'persuasive', label: '🎯 Persuasive' },
        { value: 'urgent', label: '⏰ Urgent' },
        { value: 'empathetic', label: '❤️ Empathetic' },
        { value: 'concise', label: '⚡ Concise' },
        { value: 'detailed', label: '📝 Detailed' },
        { value: 'enthusiastic', label: '🚀 Enthusiastic' }
    ];

    tones.forEach(t => {
        const option = document.createElement('option');
        option.value = t.value;
        option.text = t.label;
        if (t.value === defaultValue) {
            option.selected = true;
        }
        select.appendChild(option);
    });

    return select;
}

function createLanguageSelect(defaultValue) {
    const select = document.createElement('select');
    select.className = 'mailgenie-select mailgenie-lang-select';
    select.title = 'Select reply language';

    const languages = [
        { value: 'English', label: '🇺🇸 EN' },
        { value: 'Spanish', label: '🇪🇸 ES' },
        { value: 'French', label: '🇫🇷 FR' },
        { value: 'German', label: '🇩🇪 DE' },
        { value: 'Italian', label: '🇮🇹 IT' },
        { value: 'Japanese', label: '🇯🇵 JA' },
        { value: 'Chinese', label: '🇨🇳 ZH' },
        { value: 'Hindi', label: '🇮🇳 HI' },
        { value: 'Portuguese', label: '🇵🇹 PT' }
    ];

    languages.forEach(l => {
        const option = document.createElement('option');
        option.value = l.value;
        option.text = l.label;
        if (l.value === defaultValue) {
            option.selected = true;
        }
        select.appendChild(option);
    });

    return select;
}

function createTemplateSelect() {
    const select = document.createElement('select');
    select.className = 'mailgenie-select mailgenie-template-select';
    select.title = 'Quick Reply Presets / Prompts';

    const templates = [
        { value: '', label: '💡 Templates' },
        { value: 'thank_confirm', label: '🙏 Thank & Confirm' },
        { value: 'schedule_meeting', label: '📅 Schedule Meeting' },
        { value: 'polite_decline', label: '✋ Decline Gracefully' },
        { value: 'request_info', label: '❓ Request Details' },
        { value: 'follow_up', label: '📌 Polite Follow-up' },
        { value: 'custom_prompt', label: '✏️ Custom Prompt...' }
    ];

    templates.forEach(t => {
        const option = document.createElement('option');
        option.value = t.value;
        option.text = t.label;
        select.appendChild(option);
    });

    return select;
}

// Custom Prompt Dialog Modal
function openCustomPromptModal(onApply) {
    const existingModal = document.getElementById('mailgenie-custom-modal');
    if (existingModal) existingModal.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'mailgenie-custom-modal';
    backdrop.className = 'mailgenie-modal-backdrop';

    const content = document.createElement('div');
    content.className = 'mailgenie-modal-card';
    content.innerHTML = `
        <div class="mailgenie-modal-header">
            <h3>✨ MailGenie Custom Prompt</h3>
            <button class="mailgenie-modal-close">&times;</button>
        </div>
        <div class="mailgenie-modal-body">
            <label for="mailgenie-custom-input">Specify custom instructions for AI reply:</label>
            <textarea id="mailgenie-custom-input" placeholder="e.g. Thank them for the invite and propose meeting next Tuesday at 3 PM EST. Ask to send calendar invite."></textarea>
        </div>
        <div class="mailgenie-modal-footer">
            <button class="mailgenie-btn mailgenie-btn-cancel">Cancel</button>
            <button class="mailgenie-btn mailgenie-btn-primary mailgenie-btn-submit">Generate Reply</button>
        </div>
    `;

    backdrop.appendChild(content);
    document.body.appendChild(backdrop);

    const input = content.querySelector('#mailgenie-custom-input');
    input.focus();

    const closeModal = () => backdrop.remove();

    content.querySelector('.mailgenie-modal-close').addEventListener('click', closeModal);
    content.querySelector('.mailgenie-btn-cancel').addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
    });

    content.querySelector('.mailgenie-btn-submit').addEventListener('click', () => {
        const promptText = input.value.trim();
        if (promptText) {
            closeModal();
            onApply(promptText);
        } else {
            input.style.borderColor = '#ef4444';
        }
    });
}

function getEmailContent(composeContainer) {
    const selectors = [
        '.a3s.aiL',
        '.gmail_quote',
        '.h7',
        '[role="presentation"]',
        '[data-message-id]'
    ];

    if (composeContainer) {
        const threadContainer = composeContainer.closest('.g3') || composeContainer.closest('.dw') || composeContainer.closest('.nH');
        if (threadContainer) {
            for (const selector of selectors) {
                const content = threadContainer.querySelector(selector);
                if (content && content.innerText.trim()) {
                    return content.innerText.trim();
                }
            }
        }
    }

    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content && content.innerText.trim()) {
            return content.innerText.trim();
        }
    }
    return '';
}

// Standardized single-pass compose container locator
function findComposeContainers() {
    const containers = new Set();

    // Main Gmail compose dialog forms / windows
    const mainComposeBoxes = document.querySelectorAll('div[role="dialog"], form.aaq, .gM, .nH.if, .dw .g3');
    mainComposeBoxes.forEach(box => {
        if (box.querySelector('[role="textbox"][g_editable="true"]') || box.querySelector('.btC')) {
            containers.add(box);
        }
    });

    // Fallback: search by send button parents
    const sendButtons = document.querySelectorAll('div[aria-label*="Send"], [role="button"][aria-label*="Send"]');
    sendButtons.forEach(btn => {
        const parentDialog = btn.closest('[role="dialog"]') || btn.closest('form') || btn.closest('.gM') || btn.closest('.nH.if') || btn.closest('.btC')?.parentElement;
        if (parentDialog) {
            containers.add(parentDialog);
        }
    });

    return Array.from(containers);
}

// Cleanup duplicate wrappers if DOM mutations created duplicates
function cleanupDuplicateToolbars() {
    const wrappers = document.querySelectorAll('.mailgenie-wrapper');
    const seenContainers = new Set();

    wrappers.forEach(wrapper => {
        const parentContainer = wrapper.closest('[role="dialog"]') || wrapper.closest('form') || wrapper.closest('.gM') || wrapper.parentElement;
        if (parentContainer) {
            if (seenContainers.has(parentContainer)) {
                wrapper.remove();
            } else {
                seenContainers.add(parentContainer);
            }
        }
    });
}

async function injectButton() {
    if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.id) {
        return;
    }

    cleanupDuplicateToolbars();

    const composeContainers = findComposeContainers();
    if (composeContainers.length === 0) return;

    const settings = await getSettings();

    composeContainers.forEach(container => {
        // Prevent multiple injections in the exact same compose window
        if (container.getAttribute('data-mailgenie-injected') === 'true' || container.querySelector('.mailgenie-wrapper')) {
            return;
        }

        // Find primary target toolbar inside compose container
        const toolbar = container.querySelector('.btC') || container.querySelector('[role="toolbar"]') || container.querySelector('.gU.Up');
        if (!toolbar) return;

        // Double check again to prevent race condition
        if (toolbar.querySelector('.mailgenie-wrapper')) return;

        container.setAttribute('data-mailgenie-injected', 'true');
        console.log("MailGenie: Injecting unified toolbar control");

        // Wrapper container
        const wrapper = document.createElement('div');
        wrapper.className = 'mailgenie-wrapper';

        // Detect theme
        const theme = detectTheme(toolbar);
        if (theme === 'dark') {
            wrapper.classList.add('mailgenie-dark');
        }

        const button = createAIButton();
        const undoButton = createUndoButton();
        const toneSelect = createToneSelect(settings.defaultTone);
        const langSelect = createLanguageSelect(settings.defaultLanguage);
        const templateSelect = createTemplateSelect();
        const copyButton = createCopyButton();

        wrapper.appendChild(button);
        wrapper.appendChild(undoButton);
        wrapper.appendChild(toneSelect);
        wrapper.appendChild(langSelect);
        wrapper.appendChild(templateSelect);
        wrapper.appendChild(copyButton);

        // Core Generation Handler
        const executeGeneration = async (customPrompt = '') => {
            const emailContent = getEmailContent(container);
            if (!emailContent) {
                showToast('Could not find original email thread content to reply to', 'error');
                return;
            }

            const composeBox = container.querySelector('[role="textbox"][g_editable="true"]');
            if (!composeBox) {
                showToast('Gmail compose textbox not detected', 'error');
                return;
            }

            // Save undo snapshot
            const currentContent = composeBox.innerHTML || composeBox.innerText || '';
            composeUndoStateMap.set(container, currentContent);
            undoButton.disabled = false;
            undoButton.classList.add('mailgenie-btn-active');

            try {
                button.classList.add('mailgenie-loading');
                button.querySelector('.mailgenie-btn-icon').innerHTML = '⌛';
                button.querySelector('.mailgenie-btn-text').textContent = 'Drafting...';
                button.disabled = true;
                toneSelect.disabled = true;
                langSelect.disabled = true;
                templateSelect.disabled = true;

                const selectedTone = toneSelect.value;
                const selectedLanguage = langSelect.value;

                let instructions = customPrompt;
                if (!instructions && templateSelect.value && templateSelect.value !== 'custom_prompt') {
                    const presetLabel = templateSelect.options[templateSelect.selectedIndex].text;
                    instructions = `Preset guidance: ${presetLabel}`;
                }

                const response = await fetch(`${settings.backendUrl}/api/email/generate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        emailContent: emailContent,
                        tone: selectedTone,
                        provider: settings.provider,
                        model: settings.customModel,
                        language: selectedLanguage,
                        apiKey: settings.apiKey,
                        customInstructions: instructions
                    })
                });

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(text || 'API Request Failed');
                }

                const generatedReply = await response.text();

                // Focus & Insert into Gmail compose editor
                composeBox.focus();
                
                // Format text into HTML paragraphs if multi-line
                const formattedHtml = generatedReply.split('\n').map(line => line.trim() ? `<p>${line}</p>` : '<br>').join('');
                document.execCommand('insertHTML', false, formattedHtml);

                showToast('AI reply inserted into draft!', 'success');
            } catch (error) {
                console.error('MailGenie Error:', error);
                showToast(`Generation failed: ${error.message}`, 'error', 4500);
            } finally {
                button.classList.remove('mailgenie-loading');
                button.querySelector('.mailgenie-btn-icon').innerHTML = '✨';
                button.querySelector('.mailgenie-btn-text').textContent = 'AI Reply';
                button.disabled = false;
                toneSelect.disabled = false;
                langSelect.disabled = false;
                templateSelect.disabled = false;
            }
        };

        // Event listeners
        button.addEventListener('click', () => executeGeneration());

        undoButton.addEventListener('click', () => {
            const previousState = composeUndoStateMap.get(container);
            const composeBox = container.querySelector('[role="textbox"][g_editable="true"]');
            if (composeBox && previousState !== undefined) {
                composeBox.focus();
                composeBox.innerHTML = previousState;
                composeUndoStateMap.delete(container);
                undoButton.disabled = true;
                undoButton.classList.remove('mailgenie-btn-active');
                showToast('Reverted to previous draft state', 'undo');
            }
        });

        templateSelect.addEventListener('change', () => {
            const val = templateSelect.value;
            if (val === 'custom_prompt') {
                templateSelect.value = '';
                openCustomPromptModal((customText) => {
                    executeGeneration(customText);
                });
            } else if (val !== '') {
                executeGeneration();
            }
        });

        copyButton.addEventListener('click', () => {
            const composeBox = container.querySelector('[role="textbox"][g_editable="true"]');
            if (composeBox && composeBox.innerText.trim()) {
                navigator.clipboard.writeText(composeBox.innerText.trim());
                showToast('Draft text copied to clipboard!', 'success');
            } else {
                showToast('Compose box is empty', 'error');
            }
        });

        // Insert wrapper cleanly into toolbar
        toolbar.insertBefore(wrapper, toolbar.firstChild);
    });
}

// Observe Gmail DOM mutations with debounce
let injectTimeout = null;
const observer = new MutationObserver(() => {
    if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.id) {
        observer.disconnect();
        return;
    }

    if (injectTimeout) {
        clearTimeout(injectTimeout);
    }
    injectTimeout = setTimeout(injectButton, 250);
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Run immediately
injectButton();

// Fallback interval
const fallbackInterval = setInterval(() => {
    if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.id) {
        clearInterval(fallbackInterval);
        return;
    }
    injectButton();
}, 1200);