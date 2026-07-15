// MailGenie: Premium Gmail Integration Content Script
console.log("MailGenie Extension - Content Script Loaded");

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

function createAIButton() {
    const button = document.createElement('button');
    button.className = 'mailgenie-btn';
    button.innerHTML = '✨ AI Reply';
    button.setAttribute('type', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');
    return button;
}

function createToneSelect(defaultValue) {
    const select = document.createElement('select');
    select.className = 'mailgenie-select';
    select.title = 'Select reply tone';
    
    const tones = [
        { value: '', label: 'Default' },
        { value: 'professional', label: '👔 Professional' },
        { value: 'casual', label: '☕ Casual' },
        { value: 'friendly', label: '😊 Friendly' },
        { value: 'persuasive', label: '🎯 Persuasive' },
        { value: 'urgent', label: '⏰ Urgent' },
        { value: 'empathetic', label: '❤️ Empathetic' }
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
    select.className = 'mailgenie-select';
    select.title = 'Select reply language';

    const languages = [
        { value: 'English', label: '🇺🇸 EN' },
        { value: 'Spanish', label: '🇪🇸 ES' },
        { value: 'French', label: '🇫🇷 FR' },
        { value: 'German', label: '🇩🇪 DE' },
        { value: 'Italian', label: '🇮🇹 IT' },
        { value: 'Japanese', label: '🇯🇵 JA' },
        { value: 'Chinese', label: '🇨🇳 ZH' },
        { value: 'Hindi', label: '🇮🇳 HI' }
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

function getEmailContent(composeContainer) {
    // If the compose window is inline, try to find the email content nearby first.
    // Otherwise fall back to the standard global selectors.
    const selectors = [
        '.a3s.aiL',
        '.gmail_quote',
        '.h7',
        '[role="presentation"]'
    ];

    if (composeContainer) {
        const threadContainer = composeContainer.closest('.g3') || composeContainer.closest('.dw');
        if (threadContainer) {
            for (const selector of selectors) {
                const contents = threadContainer.querySelectorAll(selector);
                if (contents.length > 0) {
                    const latestContent = contents[contents.length - 1];
                    if (latestContent && latestContent.innerText.trim()) {
                        return latestContent.innerText.trim();
                    }
                }
            }
        }
    }

    for (const selector of selectors) {
        const contents = document.querySelectorAll(selector);
        if (contents.length > 0) {
            const latestContent = contents[contents.length - 1];
            if (latestContent && latestContent.innerText.trim()) {
                return latestContent.innerText.trim();
            }
        }
    }
    return '';
}

function findComposeBox(toolbar) {
    // 1. Try to find the closest common container for compose/reply
    const containers = [
        '[role="dialog"]',
        '.AD',            // standard Gmail compose container
        'form',
        'table',
        '.M9',            // compose container class
        '.g3',            // thread/reply container
        '.dw',            // main Gmail workspace container
        'body'            // fallback to body
    ];

    for (const containerSelector of containers) {
        const container = toolbar.closest(containerSelector);
        if (container) {
            // Find the contenteditable text area inside this container
            const selectors = [
                '[role="textbox"][contenteditable="true"]',
                '[role="textbox"][g_editable="true"]',
                '[contenteditable="true"]',
                '.editable'
            ];
            for (const selector of selectors) {
                const box = container.querySelector(selector);
                if (box) {
                    return { box, container };
                }
            }
        }
    }
    
    // 2. Global fallback (as last resort, find any active or first editable box)
    const globalBox = document.querySelector('[role="textbox"][contenteditable="true"]') || 
                      document.querySelector('[contenteditable="true"]');
    if (globalBox) {
        return { box: globalBox, container: document.body };
    }
    
    return { box: null, container: null };
}

function findComposeToolbars() {
    const toolbars = new Set();
    
    // Method 1: Find standard Gmail compose toolbars by class
    const btCContainers = document.querySelectorAll('.btC');
    btCContainers.forEach(el => toolbars.add(el));
    
    // Method 2: Find using role="toolbar"
    const roleToolbars = document.querySelectorAll('[role="toolbar"]');
    roleToolbars.forEach(el => {
        if (el.querySelector('.btC') || el.closest('.btC') || el.classList.contains('btC')) {
            toolbars.add(el.closest('.btC') || el);
        }
    });

    // Method 3: Find by locating the Send button and going to its container
    const sendButtons = document.querySelectorAll('div[data-tooltip*="Send"], div[aria-label*="Send"], [role="button"][aria-label*="Send"]');
    sendButtons.forEach(btn => {
        const parentToolbar = btn.closest('.btC') || btn.closest('.gU.Up') || btn.parentElement;
        if (parentToolbar) {
            toolbars.add(parentToolbar);
        }
    });

    return Array.from(toolbars);
}

async function injectButton() {
    // Check if context is invalidated
    if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.id) {
        return;
    }

    const toolbars = findComposeToolbars();
    if (toolbars.length === 0) {
        return;
    }
    
    // Fetch user settings
    const settings = await getSettings();

    toolbars.forEach(toolbar => {
        // Prevent duplicate injection
        if (toolbar.querySelector('.mailgenie-wrapper')) {
            return;
        }

        console.log("MailGenie: Injecting controls into toolbar");

        // Create wrapper container
        const wrapper = document.createElement('div');
        wrapper.className = 'mailgenie-wrapper';

        // Detect theme and apply appropriate styles
        const theme = detectTheme(toolbar);
        if (theme === 'dark') {
            wrapper.classList.add('mailgenie-dark');
        }

        const button = createAIButton();
        const toneSelect = createToneSelect(settings.defaultTone);
        const langSelect = createLanguageSelect(settings.defaultLanguage);

        wrapper.appendChild(button);
        wrapper.appendChild(toneSelect);
        wrapper.appendChild(langSelect);

        button.addEventListener('click', async () => {
            const { box: composeBox, container: composeContainer } = findComposeBox(toolbar);
            let emailContent = getEmailContent(composeContainer);
            let isComposeMode = false;

            if (!emailContent) {
                // Check if user has typed something in the compose box to use as instructions
                if (composeBox && composeBox.innerText.trim()) {
                    emailContent = composeBox.innerText.trim();
                    isComposeMode = true;
                }
            }

            if (!emailContent) {
                alert('MailGenie: Please open an email thread to reply to, or type a brief instruction in the editor to generate a new email.');
                return;
            }

            try {
                button.innerHTML = '⌛ Drafting...';
                button.disabled = true;
                toneSelect.disabled = true;
                langSelect.disabled = true;

                const selectedTone = toneSelect.value;
                const selectedLanguage = langSelect.value;

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
                        apiKey: settings.apiKey, // Pass custom API key to override backend setting if supplied
                        composeMode: isComposeMode
                    })
                });

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(text || 'API Request Failed');
                }

                const generatedReply = await response.text();

                if (composeBox) {
                    composeBox.focus();
                    
                    // Collapse selection to start of the editor (before signatures/quotes)
                    try {
                        const selection = window.getSelection();
                        const range = document.createRange();
                        range.selectNodeContents(composeBox);
                        range.collapse(true); // true collapses range to its start
                        selection.removeAllRanges();
                        selection.addRange(range);
                    } catch (cursorError) {
                        console.warn('MailGenie: Could not set cursor to start of composer', cursorError);
                    }
                    
                    let inserted = false;
                    try {
                        inserted = document.execCommand('insertText', false, generatedReply);
                    } catch (e) {
                        console.warn('MailGenie: execCommand failed, falling back to Selection/Range API.', e);
                    }
                    
                    if (!inserted) {
                        try {
                            const selection = window.getSelection();
                            if (selection.rangeCount > 0) {
                                const range = selection.getRangeAt(0);
                                range.deleteContents();
                                const textNode = document.createTextNode(generatedReply);
                                range.insertNode(textNode);
                                range.collapse(false);
                                selection.removeAllRanges();
                                selection.addRange(range);
                                inserted = true;
                            }
                        } catch (selError) {
                            console.error('MailGenie: Selection API insertion failed.', selError);
                        }
                    }
                    
                    if (!inserted) {
                        // Hard fallback: prepend generated email text to preserve signature/replies
                        composeBox.innerHTML = generatedReply.replace(/\n/g, '<br>') + '<br><br>' + composeBox.innerHTML;
                    }
                    
                    // Dispatch change events to trigger Gmail's internal state updates
                    composeBox.dispatchEvent(new Event('input', { bubbles: true }));
                    composeBox.dispatchEvent(new Event('change', { bubbles: true }));
                } else {
                    console.error('MailGenie: Gmail compose textbox not found');
                    alert('MailGenie: Could not insert reply automatically. Copying generated draft to clipboard instead!');
                    navigator.clipboard.writeText(generatedReply);
                }
            } catch (error) {
                console.error('MailGenie Error:', error);
                alert(`MailGenie: Failed to generate reply. Details: ${error.message}`);
            } finally {
                button.innerHTML = '✨ AI Reply';
                button.disabled = false;
                toneSelect.disabled = false;
                langSelect.disabled = false;
            }
        });

        // Insert controls as first element in toolbar
        toolbar.insertBefore(wrapper, toolbar.firstChild);
    });
}

// Observe Gmail DOM mutations with debounce/throttling to handle dynamic compose rendering
let injectTimeout = null;
const observer = new MutationObserver(() => {
    // Graceful invalidation check: stop observer if extension context is invalidated
    if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.id) {
        observer.disconnect();
        console.log("MailGenie: Context invalidated, disconnected MutationObserver.");
        return;
    }

    if (injectTimeout) {
        clearTimeout(injectTimeout);
    }
    injectTimeout = setTimeout(injectButton, 300);
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Run immediately on script load
injectButton();

// Fallback interval to guarantee rendering in edge cases (e.g. context restores, fast SPA state changes)
const fallbackInterval = setInterval(() => {
    if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.id) {
        clearInterval(fallbackInterval);
        return;
    }
    injectButton();
}, 1000);