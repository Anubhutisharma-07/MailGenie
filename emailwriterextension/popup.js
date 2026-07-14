document.addEventListener('DOMContentLoaded', () => {
  const backendUrlInput = document.getElementById('backendUrl');
  const providerSelect = document.getElementById('provider');
  const apiKeyInput = document.getElementById('apiKey');
  const defaultToneSelect = document.getElementById('defaultTone');
  const defaultLanguageSelect = document.getElementById('defaultLanguage');
  const customModelInput = document.getElementById('customModel');
  const saveBtn = document.getElementById('saveBtn');
  const statusMsg = document.getElementById('status');
  const serverStatus = document.getElementById('serverStatus');

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
    
    // Check server status and provider configurations immediately on load
    checkServerStatus(items.backendUrl);
  });

  // Save configurations
  saveBtn.addEventListener('click', () => {
    let backendUrl = backendUrlInput.value.trim() || 'http://localhost:8080';
    
    // Auto-prepend protocol if missing
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
      // Show success indicator
      statusMsg.classList.remove('hide');
      
      // Recheck server status
      checkServerStatus(backendUrl);

      setTimeout(() => {
        statusMsg.classList.add('hide');
      }, 2500);
    });
  });

  // Helper to ping backend server status and fetch active configurations
  function checkServerStatus(url) {
    serverStatus.textContent = 'Checking...';
    serverStatus.className = 'status-indicator';

    // Remove trailing slash if present
    const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;

    fetch(`${cleanUrl}/api/email/config`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('API server returned error status');
      })
      .then(config => {
        serverStatus.textContent = 'Online';
        serverStatus.className = 'status-indicator status-online';
        updateProviderOptions(config);
      })
      .catch(() => {
        serverStatus.textContent = 'Offline';
        serverStatus.className = 'status-indicator status-offline';
        updateProviderOptions(null);
      });
  }

  // Label options based on their configuration state in the backend
  function updateProviderOptions(config) {
    const options = providerSelect.options;
    for (let i = 0; i < options.length; i++) {
      const opt = options[i];
      const provider = opt.value;
      
      // Clean previous suffixes
      let label = opt.text.replace(/ \(Configured\)| \(Key Missing\)| \(Offline\)/g, '');
      
      if (!config) {
        opt.text = label; // Reset on error
        opt.style.color = '';
        continue;
      }
      
      const isConfigured = config[provider] || false;
      if (isConfigured) {
        opt.text = label + ' (Configured)';
        opt.style.color = '#10b981'; // Green
      } else {
        opt.text = label + ' (Key Missing)';
        opt.style.color = '#f55036'; // Red
      }
    }
  }
});
