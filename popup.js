document.addEventListener('DOMContentLoaded', function() {
  const feedToggle = document.getElementById('feedToggle');
  const jobsToggle = document.getElementById('jobsToggle');

  // Load saved states
  chrome.storage.sync.get(['feedHidden', 'autoRedirectJobs'], (data) => {
    feedToggle.checked = data.feedHidden || false;
    jobsToggle.checked = data.autoRedirectJobs || false;
  });

  // Save feed toggle state on change
  feedToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ feedHidden: feedToggle.checked });
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleFeed', hidden: feedToggle.checked });
    });
  });

  // Save jobs toggle state on change
  jobsToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ autoRedirectJobs: jobsToggle.checked });
    if (jobsToggle.checked) {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0].url.startsWith('https://www.linkedin.com/')) {
          chrome.tabs.update(tabs[0].id, { url: 'https://www.linkedin.com/jobs/' });
        }
      });
    }
  });
});