import React, { useState, useEffect } from 'react';

export default function NewTab(): JSX.Element {
  const [redirectCount, setRedirectCount] = useState(0);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get('redirectCount', (result: { redirectCount: number }) => {
        if (result.redirectCount) {
          setRedirectCount(result.redirectCount);
        }
      });
    }

    // Increment the redirect count when the new tab page loads
    chrome.runtime.sendMessage('incrementRedirectCount');
  }, []);

  chrome.runtime.onMessage.addListener((message: string, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
    if (message === 'incrementRedirectCount') {
      incrementRedirectCount();
    }
  });

  function incrementRedirectCount() {
    chrome.storage.sync.get('redirectCount', (result: { redirectCount: number }) => {
      const newCount = result.redirectCount ? result.redirectCount + 1 : 1;
      chrome.storage.sync.set({ redirectCount: newCount }, () => {
        // Update the redirect count in state after it's been saved to storage
        setRedirectCount(newCount);
      });
    });
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-800">
      <h1 className="text-4xl font-bold text-white mb-6">You have been kept in flow state</h1>
      <div className="bg-white rounded-lg shadow-lg p-8">
        <span className="text-6xl font-bold">{redirectCount}</span>
        <span className="text-xl font-semibold ml-4">times</span>
      </div>
    </div>
  );
}
