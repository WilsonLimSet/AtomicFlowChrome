function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setupBlockingRules(isChecked: boolean[]) {
  const blockedSites: string[] = [];
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

  const rules = blockedSites.map((site) => ({
    id: getRandomInt(1, 10000000) as number,
    priority: 1,
    action: { type: 'redirect', redirect: { url: 'chrome-extension://innkffgfdhoihnbdfigkjhlplhgmhfnm/src/pages/newtab/index.html' } },
    condition: { urlFilter: site, resourceTypes: ['main_frame'] },
  }));

  console.log('Rules:', rules);
  
  chrome.declarativeNetRequest.getDynamicRules().then((existingRules:any) => {
    const ruleIds = existingRules.map((rule:any) => rule.id);
    chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: ruleIds, addRules: rules }, () => {
      console.log('Blocking rules updated');
    });
  }).catch((error:any) => {
    console.error('Error fetching dynamic rules:', error);
  });
}


chrome.runtime.onInstalled.addListener(() => {
  // Set up a listener for incoming messages from the popup
  chrome.runtime.onMessage.addListener((message: string, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void)=>{
    if (message === 'getBlockedSites') {
      // Retrieve the blocked sites from storage
      chrome.storage.sync.get('blockedSites', (result: {blockedSites: string[]}) => {
        // Send the blocked sites back to the popup
        sendResponse(result.blockedSites);
      });
      // Return true to indicate that sendResponse will be called asynchronously
      return true;
    }
  });

  chrome.storage.sync.get('isChecked', ({isChecked}: {isChecked: boolean[]}) => {
    if (isChecked) {
      setupBlockingRules(isChecked);
    }
  });

  // Listen for changes to the isChecked value in Chrome storage
  chrome.storage.onChanged.addListener((changes: {[key: string]: chrome.storage.StorageChange}) => {
    if (changes.isChecked) {
      setupBlockingRules(changes.isChecked.newValue);
    }
  });
});
