console.log("MailGenie Extension - Content Script Loaded");

// Load stored configurations with defaults
function getSettings() {
    return new Promise((resolve) => {
        chrome.storage.local.get({
            backendUrl: 'http://localhost:8080',
            provider: 'groq',
            defaultTone: 'professional',
            defaultLanguage: 'English',
            customModel: ''
        }, (items) => {
            resolve(items);
        });
    });
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

function getEmailContent() {
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'
    ];
    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content && content.innerText.trim()) {
            return content.innerText.trim();
        }
    }
    return '';
}

function findComposeToolbar() {
    const selectors = [
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gU.Up'
    ];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
    }
    return null;
}

async function injectButton() {
    const existingWrapper = document.querySelector('.mailgenie-wrapper');
    if (existingWrapper) existingWrapper.remove();

    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.log("MailGenie: Compose Toolbar not found");
        return;
    }

    console.log("MailGenie: Compose Toolbar found, injecting controls");
    
    // Fetch user settings
    const settings = await getSettings();

    // Create wrapper container
    const wrapper = document.createElement('div');
    wrapper.className = 'mailgenie-wrapper';

    const button = createAIButton();
    const toneSelect = createToneSelect(settings.defaultTone);
    const langSelect = createLanguageSelect(settings.defaultLanguage);

    wrapper.appendChild(button);
    wrapper.appendChild(toneSelect);
    wrapper.appendChild(langSelect);

    button.addEventListener('click', async () => {
        const emailContent = getEmailContent();
        if (!emailContent) {
            alert('MailGenie: Could not find any original email content to reply to. Please open an email thread.');
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
                    language: selectedLanguage
                })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'API Request Failed');
            }

            const generatedReply = await response.text();
            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');

            if (composeBox) {
                composeBox.focus();
                // Safe insertion command
                document.execCommand('insertText', false, generatedReply);
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
}

// Observe Gmail DOM mutations to inject button when compose dialog opens
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE && 
            (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDh, .btC, [role="dialog"]'))
        );

        if (hasComposeElements) {
            setTimeout(injectButton, 400);
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});