// Generate a random integer between min (inclusive) and max (inclusive)
function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialize the extension by setting up blocking rules 
//based on stored preferences
function initializeExtension() {
  chrome.storage.sync.get('isChecked', ({isChecked}: {isChecked: boolean[]}) => {
    if (isChecked) {
      setupBlockingRules(isChecked);
    }
  });
}

// Set up blocking rules based on the isChecked array (user preferences)
function setupBlockingRules(isChecked: boolean[]) {
  console.log('setupBlockingRules called with isChecked:', isChecked);
  const blockedSites: string[] = [];
  // Add sites to the blockedSites array based on the user's preferences
  if (isChecked[0]) {
    blockedSites.push('*://*.youtube.com/*');
  }
  if (isChecked[1]) {
    blockedSites.push('*://*.twitter.com/*');
  }
  if (isChecked[2]) {
    blockedSites.push('*://*.reddit.com/*');
  }
  if (isChecked[3]) {
    blockedSites.push('*://*.instagram.com/*');
  }
  if (isChecked[4]) {
    blockedSites.push('*://*.linkedin.com/*');
  }

  // Create rules for blocking sites
  const rules = blockedSites.map((site) => ({
    id: getRandomInt(1, 100000000) as number,
    priority: 1,
    action: { type: 'redirect', redirect: { url: 'chrome-extension://innkffgfdhoihnbdfigkjhlplhgmhfnm/src/pages/newtab/index.html' } },
    condition: { urlFilter: site, resourceTypes: ['main_frame'] },
  }));

  console.log('Rules:', rules);

  // Update the dynamic rules in the extension
  chrome.declarativeNetRequest.getDynamicRules().then((existingRules:any) => {
    const ruleIds = existingRules.map((rule:any) => rule.id);
    chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: ruleIds, addRules: rules }, () => {
      console.log('Blocking rules updated');
    });
  }).catch((error:any) => {
    console.error('Error fetching dynamic rules:', error);
  });
}

// Function called when the extension starts or a new window is created
function onExtensionStart() {
  console.log('Extension started or new window created');
  initializeExtension();
}

// Use only onInstalled and onStartup event listeners
chrome.runtime.onInstalled.addListener(onExtensionStart);
chrome.runtime.onStartup.addListener(onExtensionStart);

// Set up a listener for incoming messages from the popup and content script
chrome.runtime.onMessage.addListener((message: any, sender: any, sendResponse: (response?: any) => void) => {
  if (message === 'getBlockedSites') {
    // Retrieve the blocked sites from storage
    chrome.storage.sync.get('blockedSites', (result: { blockedSites: string[] }) => {
      // Send the blocked sites back to the popup
      sendResponse(result.blockedSites);
    });
    // Return true to indicate that sendResponse will be called asynchronously
    return true;
  } else if (message.action === "initializeExtension") {
    console.log("Initializing extension from content script");
    initializeExtension();
  }
});

// Listen for changes to the isChecked value in Chrome storage
chrome.storage.onChanged.addListener((changes: { [key: string]: chrome.storage.StorageChange }) => {
  if (changes.isChecked) {
    setupBlockingRules(changes.isChecked.newValue);
  }
});
