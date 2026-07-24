// MailGenie Options & Diagnostic Popup Script v1.1.0

document.addEventListener('DOMContentLoaded', () => {
  // DOM References
  const tabs = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  const backendUrlInput = document.getElementById('backendUrl');
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
      backendUrlInput.value = items.backendUrl;
      providerSelect.value = items.provider;
      apiKeyInput.value = items.apiKey;
      defaultToneSelect.value = items.defaultTone;
      defaultLanguageSelect.value = items.defaultLanguage;
      customModelInput.value = items.customModel;

      renderCustomTemplates(items.customTemplates || []);
      runDiagnostics(items.backendUrl);
    });
  }

  // Save Settings
  saveBtn.addEventListener('click', () => {
    let backendUrl = backendUrlInput.value.trim() || 'http://localhost:8080';

    if (backendUrl && !/^https?:\/\//i.test(backendUrl)) {
      backendUrl = 'http://' + backendUrl;
    }
    backendUrlInput.value = backendUrl;

    const provider = providerSelect.value;
    const apiKey = apiKeyInput.value.trim();
    const defaultTone = defaultToneSelect.value;
    const defaultLanguage = defaultLanguageSelect.value;
    const customModel = customModelInput.value.trim();

    chrome.storage.local.set({
      backendUrl,
      provider,
      apiKey,
      defaultTone,
      defaultLanguage,
      customModel
    }, () => {
      statusMsg.classList.remove('hide');
      runDiagnostics(backendUrl);

      setTimeout(() => {
        statusMsg.classList.add('hide');
      }, 2500);
    });
  });

  // Custom Template Operations
  addTplBtn.addEventListener('click', () => {
    const title = tplTitleInput.value.trim();
    const body = tplBodyInput.value.trim();

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
        tplTitleInput.value = '';
        tplBodyInput.value = '';
        renderCustomTemplates(res.customTemplates);
      }
    });
  });

  function renderCustomTemplates(templates) {
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
      }
    });
  }

  // Diagnostics & Health Ping
  pingBtn.addEventListener('click', () => {
    const backendUrl = backendUrlInput.value.trim() || 'http://localhost:8080';
    runDiagnostics(backendUrl);
  });

  function runDiagnostics(url) {
    if (diagServerStatus) diagServerStatus.textContent = 'Testing...';
    if (serverStatus) serverStatus.textContent = 'Testing connection...';
    if (footerDot) footerDot.className = 'footer-dot checking';

    chrome.runtime.sendMessage({
      action: 'HEALTH_CHECK',
      backendUrl: url
    }, (res) => {
      if (res && res.online) {
        if (diagServerStatus) {
          diagServerStatus.textContent = 'Online';
          diagServerStatus.className = 'status-indicator status-online';
        }
        if (diagLatency) diagLatency.textContent = `${res.latency} ms`;
        if (serverStatus) serverStatus.textContent = `Backend Online (${res.latency} ms)`;
        if (footerDot) footerDot.className = 'footer-dot online';

        updateProviderStatusList(res.config);
      } else {
        if (diagServerStatus) {
          diagServerStatus.textContent = 'Offline';
          diagServerStatus.className = 'status-indicator status-offline';
        }
        if (diagLatency) diagLatency.textContent = '-- ms';
        if (serverStatus) serverStatus.textContent = 'Backend Offline';
        if (footerDot) footerDot.className = 'footer-dot offline';

        updateProviderStatusList(null);
      }
    });
  }

  function updateProviderStatusList(config) {
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
