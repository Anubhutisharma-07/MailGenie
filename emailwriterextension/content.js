// MailGenie: Premium Gmail AI Integration Content Script (V1.1.0)
// Complete resilience framework for Gmail SPA navigation, dark mode, background worker proxying, and fallback mechanisms.

(function () {
  'use strict';

  console.log("MailGenie Extension - Content Script Loaded v1.1.0");

  let cachedTemplates = [];
  let templatesFetched = false;
  let isBackendConnected = true;
  let isContextValid = true;

  // Map of compose container to last inserted backup text (for Undo functionality)
  const undoMap = new WeakMap();

  // Guard against Extension Context Invalidation
  function checkContext() {
    try {
      if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.id) {
        isContextValid = false;
        return false;
      }
      void chrome.runtime.id;
      isContextValid = true;
      return true;
    } catch (e) {
      isContextValid = false;
      return false;
    }
  }

  // Safely send messages to background service worker with direct fallback
  function sendMessageToWorker(message) {
    return new Promise((resolve) => {
      if (!checkContext()) {
        resolve({ success: false, error: 'Extension context invalidated. Refresh Gmail tab.' });
        return;
      }

      try {
        chrome.runtime.sendMessage(message, (response) => {
          if (chrome.runtime.lastError) {
            console.warn("MailGenie: Message passing error:", chrome.runtime.lastError.message);
            resolve({ success: false, error: chrome.runtime.lastError.message });
          } else {
            resolve(response || { success: false, error: 'No response received' });
          }
        });
      } catch (err) {
        console.warn("MailGenie: Messaging failed, attempting direct fetch fallback", err);
        resolve({ success: false, error: err.message });
      }
    });
  }

  // Toast Notification System inside Gmail
  function showToast(message, type = 'info', duration = 4000) {
    const existing = document.getElementById('mailgenie-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'mailgenie-toast';
    toast.className = `mailgenie-toast mailgenie-toast-${type}`;

    const iconMap = {
      success: '✨',
      error: '⚠️',
      warning: '💡',
      info: '💌'
    };

    toast.innerHTML = `
      <span class="mailgenie-toast-icon">${iconMap[type] || '💌'}</span>
      <span class="mailgenie-toast-text">${escapeHtml(message)}</span>
      <span class="mailgenie-toast-close">&times;</span>
    `;

    document.body.appendChild(toast);

    toast.querySelector('.mailgenie-toast-close').addEventListener('click', () => {
      toast.remove();
    });

    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.add('mailgenie-toast-fadeout');
        setTimeout(() => toast.remove(), 400);
      }
    }, duration);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Get user settings safely
  async function getSettings() {
    const defaults = {
      backendUrl: 'http://localhost:8080',
      provider: 'groq',
      apiKey: '',
      defaultTone: 'professional',
      defaultLanguage: 'English',
      customModel: ''
    };

    if (!checkContext()) return defaults;

    return new Promise((resolve) => {
      try {
        chrome.storage.local.get(defaults, (items) => {
          if (chrome.runtime.lastError) {
            resolve(defaults);
          } else {
            resolve(items || defaults);
          }
        });
      } catch (e) {
        resolve(defaults);
      }
    });
  }

  // Fetch templates via Background Worker with fallback
  async function fetchTemplates(backendUrl) {
    if (templatesFetched && cachedTemplates.length > 0) return cachedTemplates;

    const response = await sendMessageToWorker({
      action: 'FETCH_TEMPLATES',
      backendUrl
    });

    if (response && response.success && Array.isArray(response.templates)) {
      cachedTemplates = response.templates;
      templatesFetched = true;
      isBackendConnected = !!response.isBackendOnline;
    } else {
      // Emergency built-in fallbacks if service worker messaging is unreachable
      cachedTemplates = [
        { title: '👔 Professional Reply', body: 'Dear [Name],\n\nThank you for reaching out. I have reviewed your request and would be glad to assist.\n\nBest regards,\n[Your Name]' },
        { title: '☕ Casual Response', body: 'Hi [Name],\n\nThanks for the update! Sounds good. Let me know if you need anything else.\n\nBest,\n[Your Name]' },
        { title: '📅 Schedule Meeting', body: 'Hi [Name],\n\nI am available for a meeting to discuss this further. Let me know what times work best for you.\n\nBest regards,\n[Your Name]' }
      ];
      templatesFetched = true;
      isBackendConnected = false;
    }

    updateConnectionBadges();
    return cachedTemplates;
  }

  // Repopulate all dynamic template selects
  function repopulateTemplateSelects() {
    const selects = document.querySelectorAll('.mailgenie-template-select');
    selects.forEach(select => {
      const currentValue = select.value;
      while (select.options.length > 1) {
        select.remove(1);
      }

      cachedTemplates.forEach(tpl => {
        const option = document.createElement('option');
        option.value = tpl.body;
        option.text = tpl.title;
        if (tpl.body === currentValue) {
          option.selected = true;
        }
        select.appendChild(option);
      });
    });
  }

  // Theme auto-detection for Gmail light/dark mode
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
      // Fallback: check document body attribute or media query
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  }

  // UI Component Constructors
  function createAIButton() {
    const button = document.createElement('button');
    button.className = 'mailgenie-btn';
    button.setAttribute('type', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Email Reply (Ctrl+Shift+G)');
    button.innerHTML = '<span class="mailgenie-btn-sparkle">✨</span> <span class="mailgenie-btn-label">AI Reply</span>';
    return button;
  }

  function createUndoButton() {
    const button = document.createElement('button');
    button.className = 'mailgenie-btn-secondary mailgenie-undo-btn';
    button.setAttribute('type', 'button');
    button.setAttribute('title', 'Undo AI insertion');
    button.style.display = 'none';
    button.innerHTML = '↩️ Undo';
    return button;
  }

  function createToneSelect(defaultValue) {
    const select = document.createElement('select');
    select.className = 'mailgenie-select mailgenie-tone-select';
    select.title = 'Select AI reply tone';

    const tones = [
      { value: '', label: '🎯 Default Tone' },
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
      if (t.value === defaultValue) option.selected = true;
      select.appendChild(option);
    });

    return select;
  }

  function createLanguageSelect(defaultValue) {
    const select = document.createElement('select');
    select.className = 'mailgenie-select mailgenie-lang-select';
    select.title = 'Select AI reply language';

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
      if (l.value === defaultValue) option.selected = true;
      select.appendChild(option);
    });

    return select;
  }

  function createTemplateSelect(defaultValue) {
    const select = document.createElement('select');
    select.className = 'mailgenie-select mailgenie-template-select';
    select.title = 'Insert pre-defined email template';

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.text = '📂 Templates';
    select.appendChild(placeholder);

    cachedTemplates.forEach(tpl => {
      const option = document.createElement('option');
      option.value = tpl.body;
      option.text = tpl.title;
      if (tpl.body === defaultValue) option.selected = true;
      select.appendChild(option);
    });

    return select;
  }

  function createStatusBadge() {
    const badge = document.createElement('span');
    badge.className = 'mailgenie-status-badge';
    badge.title = isBackendConnected ? 'MailGenie Backend Online' : 'MailGenie Offline (Using Cached/Local Templates)';
    badge.innerHTML = `<span class="mailgenie-dot ${isBackendConnected ? 'online' : 'offline'}"></span>`;
    return badge;
  }

  function updateConnectionBadges() {
    document.querySelectorAll('.mailgenie-status-badge').forEach(badge => {
      const dot = badge.querySelector('.mailgenie-dot');
      if (dot) {
        dot.className = `mailgenie-dot ${isBackendConnected ? 'online' : 'offline'}`;
      }
      badge.title = isBackendConnected ? 'MailGenie Backend Online' : 'MailGenie Offline (Using Local Fallbacks)';
    });
  }

  // Multi-tier Email Content Extraction
  function getEmailContent(composeContainer) {
    const selectors = [
      '.a3s.aiL',         // Standard email body container
      '.gmail_quote',     // Quoted email thread
      '.h7',              // Thread view wrapper
      '[role="presentation"] .ii.gt', // Detailed view body
      '.adn.ads'          // Expanded message element
    ];

    if (composeContainer) {
      const threadContainer = composeContainer.closest('.g3') || composeContainer.closest('.dw') || composeContainer.closest('.nH');
      if (threadContainer) {
        for (const selector of selectors) {
          const contents = threadContainer.querySelectorAll(selector);
          if (contents.length > 0) {
            const latestContent = contents[contents.length - 1];
            if (latestContent && latestContent.innerText.trim()) {
              return cleanEmailText(latestContent.innerText);
            }
          }
        }
      }
    }

    // Global fallback search
    for (const selector of selectors) {
      const contents = document.querySelectorAll(selector);
      if (contents.length > 0) {
        const latestContent = contents[contents.length - 1];
        if (latestContent && latestContent.innerText.trim()) {
          return cleanEmailText(latestContent.innerText);
        }
      }
    }
    return '';
  }

  // Clean raw email content to remove boilerplate footer quotes
  function cleanEmailText(text) {
    if (!text) return '';
    let cleaned = text.trim();
    // Trim common email signatures or long inline quote dividers
    const splitIndices = [
      cleaned.indexOf('On ') && cleaned.indexOf(' wrote:'),
      cleaned.indexOf('---------- Forwarded message ---------')
    ];
    
    // Pick first valid split index if available
    for (const idx of splitIndices) {
      if (idx && idx > 50) {
        cleaned = cleaned.substring(0, idx);
      }
    }

    return cleaned.trim();
  }

  // Multi-tier Compose Box Locator
  function findComposeBox(toolbar) {
    const containers = [
      '[role="dialog"]',
      '.AD',
      'form',
      'table',
      '.M9',
      '.g3',
      '.dw',
      '.aaZ',
      'body'
    ];

    for (const containerSelector of containers) {
      const container = toolbar.closest(containerSelector);
      if (container) {
        const selectors = [
          '[role="textbox"][contenteditable="true"]',
          'div[aria-label*="Message Body"]',
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

    const globalBox = document.querySelector('[role="textbox"][contenteditable="true"]') ||
                      document.querySelector('[contenteditable="true"]');
    if (globalBox) {
      return { box: globalBox, container: document.body };
    }

    return { box: null, container: null };
  }

  // Multi-tier Toolbar Locator
  function findComposeToolbars() {
    const toolbars = new Set();

    // Strategy 1: Standard Gmail toolbar container
    document.querySelectorAll('.btC').forEach(el => toolbars.add(el));

    // Strategy 2: Role="toolbar"
    document.querySelectorAll('[role="toolbar"]').forEach(el => {
      const target = el.closest('.btC') || el;
      toolbars.add(target);
    });

    // Strategy 3: Send button container
    const sendButtons = document.querySelectorAll('div[data-tooltip*="Send"], div[aria-label*="Send"], [role="button"][aria-label*="Send"]');
    sendButtons.forEach(btn => {
      const parentToolbar = btn.closest('.btC') || btn.closest('.gU.Up') || btn.parentElement;
      if (parentToolbar) {
        toolbars.add(parentToolbar);
      }
    });

    // Strategy 4: Inline reply bottom containers
    document.querySelectorAll('.gU.Up').forEach(el => toolbars.add(el));

    return Array.from(toolbars);
  }

  // Text Insertion Engine with HTML preserving and event dispatching
  function insertTextIntoComposer(composeBox, text, mode = 'prepend') {
    if (!composeBox) return false;

    composeBox.focus();

    // Store backup for Undo button
    const originalContent = composeBox.innerHTML;
    const parentContainer = composeBox.closest('[role="dialog"]') || composeBox.closest('.g3') || composeBox.parentElement;
    if (parentContainer) {
      undoMap.set(parentContainer, originalContent);
    }

    // Collapse selection to beginning of editor
    try {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(composeBox);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (e) {
      console.warn("MailGenie: Selection range collapse warning", e);
    }

    let inserted = false;

    // Method A: execCommand insertText
    try {
      inserted = document.execCommand('insertText', false, text);
    } catch (e) {
      inserted = false;
    }

    // Method B: Range API node insertion
    if (!inserted) {
      try {
        const selection = window.getSelection();
        let range;
        if (selection.rangeCount > 0) {
          range = selection.getRangeAt(0);
        } else {
          range = document.createRange();
          range.selectNodeContents(composeBox);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
        range.deleteContents();
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
        inserted = true;
      } catch (selErr) {
        inserted = false;
      }
    }

    // Method C: InnerHTML formatting fallback
    if (!inserted) {
      const formattedHtml = text.replace(/\n/g, '<br>') + '<br><br>';
      composeBox.innerHTML = formattedHtml + composeBox.innerHTML;
      inserted = true;
    }

    // Dispatch synthetic events so Gmail recognizes text change
    composeBox.dispatchEvent(new Event('input', { bubbles: true }));
    composeBox.dispatchEvent(new Event('change', { bubbles: true }));
    composeBox.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'a' }));

    return inserted;
  }

  // Core Injection Logic
  async function injectControls() {
    if (!checkContext()) return;

    const toolbars = findComposeToolbars();
    if (toolbars.length === 0) return;

    const settings = await getSettings();

    // Fetch templates asynchronously
    if (!templatesFetched) {
      fetchTemplates(settings.backendUrl).then(() => {
        repopulateTemplateSelects();
      });
    }

    toolbars.forEach(toolbar => {
      if (toolbar.querySelector('.mailgenie-wrapper')) return;

      console.log("MailGenie: Injecting controls into toolbar");

      const wrapper = document.createElement('div');
      wrapper.className = 'mailgenie-wrapper';

      const theme = detectTheme(toolbar);
      if (theme === 'dark') {
        wrapper.classList.add('mailgenie-dark');
      }

      const button = createAIButton();
      const undoBtn = createUndoButton();
      const toneSelect = createToneSelect(settings.defaultTone);
      const langSelect = createLanguageSelect(settings.defaultLanguage);
      const templateSelect = createTemplateSelect('');
      const statusBadge = createStatusBadge();

      wrapper.appendChild(statusBadge);
      wrapper.appendChild(button);
      wrapper.appendChild(undoBtn);
      wrapper.appendChild(toneSelect);
      wrapper.appendChild(langSelect);
      wrapper.appendChild(templateSelect);

      // Handle Template Selection
      templateSelect.addEventListener('change', () => {
        const tplBody = templateSelect.value;
        if (!tplBody) return;

        const { box: composeBox, container } = findComposeBox(toolbar);
        if (composeBox) {
          const success = insertTextIntoComposer(composeBox, tplBody);
          if (success) {
            showToast('Template inserted successfully!', 'success', 3000);
            if (container && undoMap.has(container)) {
              undoBtn.style.display = 'inline-flex';
            }
          }
        }
        templateSelect.value = '';
      });

      // Handle Undo Action
      undoBtn.addEventListener('click', () => {
        const { box: composeBox, container } = findComposeBox(toolbar);
        if (composeBox && container && undoMap.has(container)) {
          composeBox.innerHTML = undoMap.get(container);
          composeBox.dispatchEvent(new Event('input', { bubbles: true }));
          undoBtn.style.display = 'none';
          showToast('Restored previous text.', 'info', 2500);
        }
      });

      // Handle AI Reply Button Click
      button.addEventListener('click', async () => {
        executeAIGeneration(toolbar, button, toneSelect, langSelect, templateSelect, undoBtn);
      });

      // Insert controls into toolbar
      if (toolbar.firstChild) {
        toolbar.insertBefore(wrapper, toolbar.firstChild);
      } else {
        toolbar.appendChild(wrapper);
      }
    });
  }

  // AI Reply Execution Workflow
  async function executeAIGeneration(toolbar, button, toneSelect, langSelect, templateSelect, undoBtn) {
    if (!checkContext()) {
      showToast('MailGenie: Extension was reloaded. Please refresh Gmail tab.', 'warning');
      return;
    }

    const settings = await getSettings();
    const { box: composeBox, container: composeContainer } = findComposeBox(toolbar);

    let emailContent = getEmailContent(composeContainer);
    let isComposeMode = false;

    if (!emailContent) {
      if (composeBox && composeBox.innerText.trim()) {
        emailContent = composeBox.innerText.trim();
        isComposeMode = true;
      }
    }

    if (!emailContent) {
      showToast('Please open an email thread or type a prompt in the box to generate a reply.', 'warning', 5000);
      return;
    }

    // Set Loading UI state
    button.disabled = true;
    toneSelect.disabled = true;
    langSelect.disabled = true;
    templateSelect.disabled = true;

    const labelSpan = button.querySelector('.mailgenie-btn-label');
    const sparkleSpan = button.querySelector('.mailgenie-btn-sparkle');
    if (labelSpan) labelSpan.textContent = 'Drafting...';
    if (sparkleSpan) sparkleSpan.className = 'mailgenie-btn-sparkle mailgenie-spin';

    try {
      const response = await sendMessageToWorker({
        action: 'GENERATE_EMAIL',
        emailContent: emailContent,
        tone: toneSelect.value || settings.defaultTone,
        provider: settings.provider,
        model: settings.customModel,
        language: langSelect.value || settings.defaultLanguage,
        apiKey: settings.apiKey,
        composeMode: isComposeMode,
        backendUrl: settings.backendUrl
      });

      if (response && response.success && response.reply) {
        if (composeBox) {
          insertTextIntoComposer(composeBox, response.reply);
          showToast('✨ AI Reply generated successfully!', 'success', 3500);
          if (composeContainer && undoMap.has(composeContainer)) {
            undoBtn.style.display = 'inline-flex';
          }
        } else {
          showToast('Generated reply copied to clipboard!', 'info', 4000);
          navigator.clipboard.writeText(response.reply);
        }
      } else {
        const errorMsg = (response && response.error) ? response.error : 'Failed to generate reply.';
        showToast(errorMsg, 'error', 6000);
      }

    } catch (err) {
      console.error("MailGenie: Generation Exception", err);
      showToast('Error generating reply: ' + err.message, 'error', 6000);
    } finally {
      button.disabled = false;
      toneSelect.disabled = false;
      langSelect.disabled = false;
      templateSelect.disabled = false;
      if (labelSpan) labelSpan.textContent = 'AI Reply';
      if (sparkleSpan) sparkleSpan.className = 'mailgenie-btn-sparkle';
    }
  }

  // Floating Action Button (FAB) Fallback if Toolbar is inaccessible
  function injectFloatingActionButton() {
    if (document.getElementById('mailgenie-fab')) return;

    const fab = document.createElement('button');
    fab.id = 'mailgenie-fab';
    fab.className = 'mailgenie-fab-btn';
    fab.title = 'MailGenie Quick AI Assistant (Ctrl+Shift+G)';
    fab.innerHTML = '💌 ✨';

    fab.addEventListener('click', () => {
      const toolbars = findComposeToolbars();
      if (toolbars.length > 0) {
        const toolbar = toolbars[0];
        const wrapper = toolbar.querySelector('.mailgenie-wrapper');
        if (wrapper) {
          const btn = wrapper.querySelector('.mailgenie-btn');
          if (btn) btn.click();
        } else {
          injectControls();
        }
      } else {
        showToast('Please open a Gmail compose or reply window first.', 'info');
      }
    });

    document.body.appendChild(fab);
  }

  // Keyboard Shortcut Handler (Ctrl+Shift+G or Alt+G)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'g') || (e.altKey && e.key.toLowerCase() === 'g')) {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.isContentEditable || activeEl.getAttribute('role') === 'textbox')) {
        e.preventDefault();
        const toolbar = activeEl.closest('[role="dialog"]') || activeEl.closest('.g3') || document.querySelector('.btC');
        if (toolbar) {
          const wrapper = toolbar.querySelector('.mailgenie-wrapper') || document.querySelector('.mailgenie-wrapper');
          if (wrapper) {
            const btn = wrapper.querySelector('.mailgenie-btn');
            if (btn) btn.click();
          }
        }
      }
    }
  });

  // Observe Gmail DOM Mutations with Throttling
  let observerTimeout = null;
  const observer = new MutationObserver(() => {
    if (!checkContext()) {
      observer.disconnect();
      return;
    }

    if (observerTimeout) clearTimeout(observerTimeout);
    observerTimeout = setTimeout(() => {
      injectControls();
    }, 250);
  });

  // Initialize Observers and Setup
  function init() {
    if (!checkContext()) return;

    injectControls();
    injectFloatingActionButton();

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Fallback interval for quick SPA transitions
    const interval = setInterval(() => {
      if (!checkContext()) {
        clearInterval(interval);
        observer.disconnect();
        return;
      }
      injectControls();
    }, 1500);
  }

  // Listen for storage setting changes
  if (checkContext() && chrome.storage && chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local') {
        getSettings().then(settings => {
          document.querySelectorAll('.mailgenie-tone-select').forEach(sel => sel.value = settings.defaultTone);
          document.querySelectorAll('.mailgenie-lang-select').forEach(sel => sel.value = settings.defaultLanguage);

          if (changes.backendUrl || changes.customTemplates) {
            templatesFetched = false;
            fetchTemplates(settings.backendUrl).then(() => {
              repopulateTemplateSelects();
            });
          }
        });
      }
    });
  }

  // Run Script
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();