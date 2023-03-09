function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  let blockingRuleIds: number[] = [];
  
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
  
      const rules = blockedSites.map((site) => {
        let id = getRandomInt(1, 1000000);
        while (blockingRuleIds.includes(id)) {
          id = getRandomInt(1, 1000000);
        }
        blockingRuleIds.push(id);
        return {
          id: id,
          priority: 1,
          action: {type: 'block'},
          condition: {urlFilter: site},
        };
      });
  
      chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds: [], addRules: rules}, () => {});
    }
  });
  
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
    
      const rules = blockedSites.map((site) => {
        let id = getRandomInt(1, 1000000);
        while (blockingRuleIds.includes(id)) {
          id = getRandomInt(1, 1000000);
        }
        blockingRuleIds.push(id);
        return {
          id: id,
          priority: 1,
          action: {type: 'block'},
          condition: {urlFilter: site},
        };
      });
    
      chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds: [], addRules: rules}, () => {});
    }
  });
  