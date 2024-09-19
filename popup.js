document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('toggleButton');

  // Load saved state
  chrome.storage.sync.get('isHidden', function(data) {
    toggleButton.checked = data.isHidden !== false;
  });

  toggleButton.addEventListener('change', function() {
    const isHidden = toggleButton.checked;
    
    // Save state
    chrome.storage.sync.set({isHidden: isHidden});

    // Send message to content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "toggle", isHidden: isHidden});
    });
  });
});