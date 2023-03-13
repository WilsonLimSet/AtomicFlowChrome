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
      id: getRandomInt(1, 1000000) as number,
      priority: 1,
      action: { "type": "redirect", "redirect": { "url": "https://www.productivityblocker.com/blocked" } },
      condition: {urlFilter: site,"resourceTypes": ["main_frame"] },
    }));
    console.log('Rules:', rules);
    chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds: [], addRules: rules}, () => {});
  }
  
  chrome.runtime.onInstalled.addListener(() => {
    const redirectUrl = chrome.runtime.getURL('chrome-extension://innkffgfdhoihnbdfigkjhlplhgmhfnm/src/pages/newtab/index.html');
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
  
    chrome.storage.onChanged.addListener(({isChecked}: {isChecked?: {oldValue: boolean[], newValue: boolean[]}}) => {
      if (isChecked) {
        setupBlockingRules(isChecked.newValue);
      }
    });
  });