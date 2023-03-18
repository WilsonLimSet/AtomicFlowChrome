window.addEventListener('load', () => {
  const previousURL = sessionStorage.getItem('previousURL');
  const currentURL = window.location.href;

  // Send a message to the background script to increment the redirect count
chrome.runtime.sendMessage({ action: 'incrementRedirectCount' });

  sessionStorage.setItem('previousURL', currentURL);

  // Send a message to the background script to initialize the extension
  chrome.runtime.sendMessage({ action: 'initializeExtension' });
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message: any, sender: any, sendResponse: (response?: any) => void) => {
  if (message.action === 'logRedirect') {
    console.log(`Redirected from ${message.previousURL} to ${message.currentURL}`);
  } else if (message.action === 'incrementRedirectCount') {
    // Increment the redirect count and display it in the new tab page
    chrome.storage.local.get('redirectCount', (result: { redirectCount: number }) => {
      const count = result.redirectCount || 1;
      const div = document.createElement('div');
      div.innerText = `You have been kept in flow state ${count} times`;
      div.className = 'flow-state-count';
      document.body.appendChild(div);
    });
  }
});

