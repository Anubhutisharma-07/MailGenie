// MailGenie Options & Diagnostic Popup Script v2.0

document.addEventListener('DOMContentLoaded', () => {
  // DOM References
  const tabs = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  const backendUrlInput = document.getElementById('backendUrl');
  const testConnBtn = document.getElementById('testConnBtn');
  const providerSelect = document.getElementById('provider');
  const apiKeyInput = document.getElementById('apiKey');
  const defaultToneSelect = document.getElementById('defaultTone');
  const defaultLanguageSelect = document.getElementById('defaultLanguage');
  const customModelInput = document.getElementById('customModel');
  const saveBtn = document.getElementById('saveBtn');
  const statusMsg = document.getElementById('status');

  const tplTitleInput = document.getElementById('tplTitleInput');
  const tplBodyInput = document.getElementById('tplBodyInput');
  const addTplBtn = document.getElementById('addTplBtn');
  const customTemplatesList = document.getElementById('customTemplatesList');

  const diagServerStatus = document.getElementById('diagServerStatus');
  const diagLatency = document.getElementById('diagLatency');
  const pingBtn = document.getElementById('pingBtn');
  const providerConfigList = document.getElementById('providerConfigList');

  const serverStatus = document.getElementById('serverStatus');
  const footerDot = document.getElementById('footerDot');

  // Tab Navigation Logic
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetTab = document.getElementById(tab.getAttribute('data-tab'));
      if (targetTab) targetTab.classList.add('active');
    });
  });

  // Load Saved Configurations
  function loadSettings() {
    chrome.storage.local.get({
      backendUrl: 'http://localhost:8080',
      provider: 'groq',
      apiKey: '',
      defaultTone: 'professional',
      defaultLanguage: 'English',
      customModel: '',
      customTemplates: []
    }, (items) => {
      if (backendUrlInput) backendUrlInput.value = items.backendUrl;
      if (providerSelect) providerSelect.value = items.provider;
      if (apiKeyInput) apiKeyInput.value = items.apiKey;
      if (defaultToneSelect) defaultToneSelect.value = items.defaultTone;
      if (defaultLanguageSelect) defaultLanguageSelect.value = items.defaultLanguage;
      if (customModelInput) customModelInput.value = items.customModel;

      renderCustomTemplates(items.customTemplates || []);
      runDiagnostics(items.backendUrl);
    });
  }

  // Save Settings
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      let backendUrl = backendUrlInput ? backendUrlInput.value.trim() : 'http://localhost:8080';
      if (!backendUrl) backendUrl = 'http://localhost:8080';

      if (backendUrl && !/^https?:\/\//i.test(backendUrl)) {
        backendUrl = 'http://' + backendUrl;
      }
      if (backendUrlInput) backendUrlInput.value = backendUrl;

      const provider = providerSelect ? providerSelect.value : 'groq';
      const apiKey = apiKeyInput ? apiKeyInput.value.trim() : '';
      const defaultTone = defaultToneSelect ? defaultToneSelect.value : 'professional';
      const defaultLanguage = defaultLanguageSelect ? defaultLanguageSelect.value : 'English';
      const customModel = customModelInput ? customModelInput.value.trim() : '';

      chrome.storage.local.set({
        backendUrl,
        provider,
        apiKey,
        defaultTone,
        defaultLanguage,
        customModel
      }, () => {
        if (statusMsg) statusMsg.classList.remove('hide');
        runDiagnostics(backendUrl);

        setTimeout(() => {
          if (statusMsg) statusMsg.classList.add('hide');
        }, 2500);
      });
    });
  }

  // Test connection button
  if (testConnBtn) {
    testConnBtn.addEventListener('click', () => {
      let backendUrl = backendUrlInput ? backendUrlInput.value.trim() : 'http://localhost:8080';
      if (!backendUrl) backendUrl = 'http://localhost:8080';
      if (backendUrl && !/^https?:\/\//i.test(backendUrl)) {
        backendUrl = 'http://' + backendUrl;
      }
      runDiagnostics(backendUrl);
    });
  }

  // Custom Template Operations
  if (addTplBtn) {
    addTplBtn.addEventListener('click', () => {
      const title = tplTitleInput ? tplTitleInput.value.trim() : '';
      const body = tplBodyInput ? tplBodyInput.value.trim() : '';

      if (!title || !body) {
        alert('Please enter both a title and template content.');
        return;
      }

      chrome.runtime.sendMessage({
        action: 'SAVE_CUSTOM_TEMPLATE',
        title: title,
        body: body
      }, (res) => {
        if (res && res.success) {
          if (tplTitleInput) tplTitleInput.value = '';
          if (tplBodyInput) tplBodyInput.value = '';
          renderCustomTemplates(res.customTemplates);
        } else {
          // Local fallback saving
          chrome.storage.local.get({ customTemplates: [] }, (items) => {
            const list = items.customTemplates || [];
            list.push({ id: Date.now().toString(), title, body });
            chrome.storage.local.set({ customTemplates: list }, () => {
              if (tplTitleInput) tplTitleInput.value = '';
              if (tplBodyInput) tplBodyInput.value = '';
              renderCustomTemplates(list);
            });
          });
        }
      });
    });
  }

  function renderCustomTemplates(templates) {
    if (!customTemplatesList) return;
    customTemplatesList.innerHTML = '';
    if (!templates || templates.length === 0) {
      customTemplatesList.innerHTML = '<div class="empty-state">No custom templates saved yet.</div>';
      return;
    }

    templates.forEach(tpl => {
      const card = document.createElement('div');
      card.className = 'template-item-card';
      card.innerHTML = `
        <div class="template-item-header">
          <span class="template-item-title">${escapeHtml(tpl.title)}</span>
          <button class="delete-tpl-btn" data-id="${tpl.id}">&times;</button>
        </div>
        <div class="template-item-body">${escapeHtml(tpl.body)}</div>
      `;

      card.querySelector('.delete-tpl-btn').addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        deleteCustomTemplate(id);
      });

      customTemplatesList.appendChild(card);
    });
  }

  function deleteCustomTemplate(id) {
    chrome.runtime.sendMessage({
      action: 'DELETE_CUSTOM_TEMPLATE',
      id: id
    }, (res) => {
      if (res && res.success) {
        renderCustomTemplates(res.customTemplates);
      } else {
        chrome.storage.local.get({ customTemplates: [] }, (items) => {
          const list = (items.customTemplates || []).filter(t => t.id !== id);
          chrome.storage.local.set({ customTemplates: list }, () => {
            renderCustomTemplates(list);
          });
        });
      }
    });
  }

  // Diagnostics & Health Ping
  if (pingBtn) {
    pingBtn.addEventListener('click', () => {
      const backendUrl = backendUrlInput ? backendUrlInput.value.trim() : 'http://localhost:8080';
      runDiagnostics(backendUrl);
    });
  }

  function runDiagnostics(url) {
    if (diagServerStatus) diagServerStatus.textContent = 'Testing...';
    if (serverStatus) serverStatus.textContent = 'Testing connection...';
    if (footerDot) footerDot.className = 'footer-dot checking';

    const startTime = Date.now();
    const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;

    fetch(`${cleanUrl}/api/email/config`)
      .then(res => {
        if (!res.ok) throw new Error('API server error');
        return res.json();
      })
      .then(config => {
        const latency = Date.now() - startTime;
        if (diagServerStatus) {
          diagServerStatus.textContent = 'Online';
          diagServerStatus.className = 'status-indicator status-online';
        }
        if (diagLatency) diagLatency.textContent = `${latency} ms`;
        if (serverStatus) serverStatus.textContent = `Backend Online (${latency} ms)`;
        if (footerDot) footerDot.className = 'footer-dot online';

        updateProviderStatusList(config);
      })
      .catch(() => {
        if (diagServerStatus) {
          diagServerStatus.textContent = 'Offline';
          diagServerStatus.className = 'status-indicator status-offline';
        }
        if (diagLatency) diagLatency.textContent = '-- ms';
        if (serverStatus) serverStatus.textContent = 'Backend Offline';
        if (footerDot) footerDot.className = 'footer-dot offline';

        updateProviderStatusList(null);
      });
  }

  function updateProviderStatusList(config) {
    if (!providerConfigList) return;
    providerConfigList.innerHTML = '';
    const providers = [
      { key: 'groq', name: 'Groq LPU' },
      { key: 'openai', name: 'OpenAI GPT' },
      { key: 'gemini', name: 'Google Gemini' },
      { key: 'claude', name: 'Anthropic Claude' }
    ];

    providers.forEach(p => {
      const item = document.createElement('div');
      item.className = 'provider-status-item';

      let isConfigured = false;
      if (config && config[p.key] !== undefined) {
        isConfigured = !!config[p.key];
      }

      item.innerHTML = `
        <span>${p.name}</span>
        <span class="${isConfigured ? 'status-online' : 'status-offline'}">
          ${isConfigured ? '✓ Configured' : '✕ Key Missing'}
        </span>
      `;
      providerConfigList.appendChild(item);
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  loadSettings();
});
