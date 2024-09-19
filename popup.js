document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('toggleButton');
  const label = document.querySelector('.label');

  // Load saved state
  chrome.storage.sync.get('isHidden', function(data) {
    const isHidden = data.isHidden !== false;
    toggleButton.checked = isHidden;
    updateUI(isHidden);
    chrome.runtime.sendMessage({action: "updateIcon", isHidden: isHidden});
  });

  toggleButton.addEventListener('change', function() {
    const isHidden = toggleButton.checked;
    
    // Save state
    chrome.storage.sync.set({isHidden: isHidden}, function() {
      // Update UI
      updateUI(isHidden);

      // Send message to content script
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "toggle", isHidden: isHidden});
      });

      // Update icon
      chrome.runtime.sendMessage({action: "updateIcon", isHidden: isHidden});
    });
  });
});

function updateUI(isHidden) {
  document.body.style.backgroundColor = isHidden ? '#e6f3ff' : '#ffffff'; // Light blue when on, white when off
  document.querySelector('.label').textContent = isHidden ? 'Feed Hidden' : 'Feed Visible';
}