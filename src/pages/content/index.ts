chrome.declarativeNetRequest.onRequestActionTriggered.addListener((details:any) => {
  if (details.action.type === "redirect") {
    const previousURL = details.request.url;
    const currentURL = details.action.redirect.url;

    chrome.tabs.sendMessage(details.tabId, {
      action: "logRedirect",
      previousURL,
      currentURL,
    });
  }
});
