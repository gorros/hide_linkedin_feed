function toggleFeed(hidden) {
  const selectors = [
    '.core-rail',
    '.feed-follows-module',
    '.feed-shared-update-v2',
    '.update-components-actor',
    '.scaffold-finite-scroll__content'
  ];
  
  const rightRail = document.querySelector('.right-rail');
  const contentMain = document.querySelector('.scaffold-layout__content main');
  
  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.style.display = hidden ? 'none' : '';
    });
  });
  
  if (rightRail) {
    rightRail.style.display = hidden ? 'none' : '';
  }
  
  if (contentMain) {
    contentMain.style.width = hidden ? '100%' : '';
    contentMain.style.margin = hidden ? '0 auto' : '';
    contentMain.style.maxWidth = hidden ? '1128px' : '';
  }
}

// Apply saved state on page load and observe for changes
function applyFeedState() {
  chrome.storage.sync.get('feedHidden', (data) => {
    if (window.location.href.startsWith('https://www.linkedin.com/feed/')) {
      toggleFeed(data.feedHidden);
    }
  });
}

// Create a MutationObserver to watch for changes in the DOM
const observer = new MutationObserver((mutations) => {
  for (let mutation of mutations) {
    if (mutation.type === 'childList') {
      applyFeedState();
      break;
    }
  }
});

// Start observing the document with the configured parameters
observer.observe(document.body, { childList: true, subtree: true });

// Initial application of feed state
applyFeedState();

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleFeed') {
    if (window.location.href.startsWith('https://www.linkedin.com/feed/')) {
      toggleFeed(request.hidden);
    }
  }
});