document.addEventListener('DOMContentLoaded', () => {
  const backendUrlInput = document.getElementById('backendUrl');
  const providerSelect = document.getElementById('provider');
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
    defaultTone: 'professional',
    defaultLanguage: 'English',
    customModel: ''
  }, (items) => {
    backendUrlInput.value = items.backendUrl;
    providerSelect.value = items.provider;
    defaultToneSelect.value = items.defaultTone;
    defaultLanguageSelect.value = items.defaultLanguage;
    customModelInput.value = items.customModel;
    
    // Check server status immediately on load
    checkServerStatus(items.backendUrl);
  });

  // Save configurations
  saveBtn.addEventListener('click', () => {
    const backendUrl = backendUrlInput.value.trim() || 'http://localhost:8080';
    const provider = providerSelect.value;
    const defaultTone = defaultToneSelect.value;
    const defaultLanguage = defaultLanguageSelect.value;
    const customModel = customModelInput.value.trim();

    chrome.storage.local.set({
      backendUrl,
      provider,
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

  // Helper to ping backend server status
  function checkServerStatus(url) {
    serverStatus.textContent = 'Checking...';
    serverStatus.className = 'status-indicator';

    // Remove trailing slash if present
    const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;

    fetch(`${cleanUrl}/api/email/config`)
      .then(response => {
        if (response.ok) {
          serverStatus.textContent = 'Online';
          serverStatus.classList.add('status-online');
        } else {
          serverStatus.textContent = 'Error';
          serverStatus.classList.add('status-offline');
        }
      })
      .catch(() => {
        serverStatus.textContent = 'Offline';
        serverStatus.classList.add('status-offline');
      });
  }
});
