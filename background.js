function createIcon(color) {
  const canvas = document.createElement('canvas');
  canvas.width = 19;
  canvas.height = 19;
  const ctx = canvas.getContext('2d');

  // Draw background
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 19, 19);

  // Draw 'L'
  ctx.fillStyle = 'white';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('L', 9.5, 9.5);

  return ctx.getImageData(0, 0, 19, 19);
}

function updateIcon(isHidden) {
  const color = isHidden ? '#2196F3' : '#9E9E9E'; // Blue when on, gray when off
  chrome.browserAction.setIcon({
    imageData: createIcon(color)
  });
}

// Initialize icon state
chrome.storage.sync.get('isHidden', function(data) {
  updateIcon(data.isHidden !== false);
});

// Listen for state changes
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "updateIcon") {
    updateIcon(request.isHidden);
  }
});

// Ensure icon is updated when extension is installed or updated
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.get('isHidden', function(data) {
    updateIcon(data.isHidden !== false);
  });
});

// Add tab update listener for auto-redirect feature
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.startsWith('https://www.linkedin.com/')) {
    chrome.storage.sync.get('autoRedirectJobs', (data) => {
      if (data.autoRedirectJobs && !tab.url.startsWith('https://www.linkedin.com/jobs/')) {
        chrome.tabs.update(tabId, { url: 'https://www.linkedin.com/jobs/' });
      }
    });
  }
});
