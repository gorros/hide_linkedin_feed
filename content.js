let isHidden = true;

function toggleLinkedInFeed(forceHide = null) {
  const selectors = [
    '.core-rail',
    '.feed-follows-module',
    '.feed-shared-update-v2',
    '.update-components-actor',
    '.scaffold-finite-scroll__content'
  ];

  if (forceHide !== null) {
    isHidden = forceHide;
  }

  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.style.display = isHidden ? 'none' : '';
    });
  });
}

function observeChanges() {
  const targetNode = document.body;
  const config = { childList: true, subtree: true };
  const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList' && isHidden) {
        toggleLinkedInFeed();
      }
    }
  });
  observer.observe(targetNode, config);
}

// Load initial state
chrome.storage.sync.get('isHidden', function(data) {
  isHidden = data.isHidden !== false;
  toggleLinkedInFeed();
  observeChanges();
});

// Listen for toggle message from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggle") {
    toggleLinkedInFeed(request.isHidden);
  }
});

// Periodically check and hide (as a fallback)
setInterval(() => {
  if (isHidden) {
    toggleLinkedInFeed();
  }
}, 1000);