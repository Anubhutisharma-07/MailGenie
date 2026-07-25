document.addEventListener('DOMContentLoaded', () => {
  const backendUrlInput = document.getElementById('backendUrl');
  const testConnBtn = document.getElementById('testConnBtn');
  const providerSelect = document.getElementById('provider');
  const apiKeyInput = document.getElementById('apiKey');
  const defaultToneSelect = document.getElementById('defaultTone');
  const defaultLanguageSelect = document.getElementById('defaultLanguage');
  const customModelInput = document.getElementById('customModel');
  const saveBtn = document.getElementById('saveBtn');
  const statusMsg = document.getElementById('status');
  const serverStatus = document.getElementById('serverStatus');
  const statusBox = document.querySelector('.server-status-box');

  // Load saved configurations
  chrome.storage.local.get({
    backendUrl: 'http://localhost:8080',
    provider: 'groq',
    apiKey: '',
    defaultTone: 'professional',
    defaultLanguage: 'English',
    customModel: ''
  }, (items) => {
    backendUrlInput.value = items.backendUrl;
    providerSelect.value = items.provider;
    apiKeyInput.value = items.apiKey;
    defaultToneSelect.value = items.defaultTone;
    defaultLanguageSelect.value = items.defaultLanguage;
    customModelInput.value = items.customModel;
    
    checkServerStatus(items.backendUrl);
  });

  // Save configurations
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
      checkServerStatus(backendUrl);

      setTimeout(() => {
        statusMsg.classList.add('hide');
      }, 2500);
    });
  });

  // Test connection button
  testConnBtn.addEventListener('click', () => {
    let backendUrl = backendUrlInput.value.trim() || 'http://localhost:8080';
    if (backendUrl && !/^https?:\/\//i.test(backendUrl)) {
      backendUrl = 'http://' + backendUrl;
    }
    checkServerStatus(backendUrl);
  });

  // Ping backend server status
  function checkServerStatus(url) {
    serverStatus.textContent = 'Checking server connection...';
    statusBox.className = 'server-status-box';

    const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;

    fetch(`${cleanUrl}/api/email/config`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('API server unreachable');
      })
      .then(config => {
        serverStatus.textContent = 'Server Online & Ready';
        statusBox.className = 'server-status-box status-online';
        updateProviderOptions(config);
      })
      .catch(() => {
        serverStatus.textContent = 'Server Offline (check Backend)';
        statusBox.className = 'server-status-box status-offline';
        updateProviderOptions(null);
      });
  }

  function updateProviderOptions(config) {
    const options = providerSelect.options;
    for (let i = 0; i < options.length; i++) {
      const opt = options[i];
      const provider = opt.value;
      
      let label = opt.text.replace(/ \(Configured\)| \(Key Missing\)| \(Offline\)/g, '');
      
      if (!config) {
        opt.text = label;
        opt.style.color = '';
        continue;
      }
      
      const isConfigured = config[provider] || false;
      if (isConfigured) {
        opt.text = label + ' (Configured)';
        opt.style.color = '#10b981';
      } else {
        opt.text = label + ' (Key Missing)';
        opt.style.color = '#f55036';
      }
    }
  }
});
