function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
  
    // Set up the blocking rules when the extension is installed or updated
    chrome.storage.sync.get('isChecked', ({isChecked}: {isChecked: boolean[]}) => {
      if (isChecked) {
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
          id: getRandomInt(1, 1000000),
          priority: 1,
          action: {type: 'block'},
          condition: {urlFilter: site},
        }));
  
        chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds: [], addRules: rules}, () => {});
      }
    });
  
    // Set up a listener for changes to the isChecked state
    chrome.storage.onChanged.addListener(({isChecked}: {isChecked?: {oldValue: boolean[], newValue: boolean[]}}) => {
      if (isChecked) {
        const blockedSites: string[] = [];
        if (isChecked.newValue[0]) {
          blockedSites.push('*://*.youtube.com/*');
        }
        if (isChecked.newValue[1]) {
          blockedSites.push('*://*.twitter.com/*');
        }
        if (isChecked.newValue[2]) {
          blockedSites.push('*://*.reddit.com/*');
        }
        if (isChecked.newValue[3]) {
          blockedSites.push('*://*.instagram.com/*');
        }
        if (isChecked.newValue[4]) {
          blockedSites.push('*://*.linkedin.com/*');
        }
  
        const rules = blockedSites.map((site) => ({
          id: getRandomInt(1, 1000000) as number,
          priority: 1,
          action: {type: 'block'},
          condition: {urlFilter: site},
        }));
  
        chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds: [], addRules: rules}, () => {});
      }
    });

    chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [
          {
            id: getRandomInt(1, 1000000),
            priority: 1,
            action: {
              type: 'redirect',
              redirect: { regexSubstitution: 'chrome://extensions/?id=innkffgfdhoihnbdfigkjhlplhgmhfnm/src/pages/newtab/index.html' },
            },
            condition: {
              urlFilter: '*://*.youtube.com/*',
            },
          },
        ],
      });
  });
  