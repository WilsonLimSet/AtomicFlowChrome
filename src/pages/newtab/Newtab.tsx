import React, { useState, useEffect } from 'react';

export default function NewTab(): JSX.Element {
  const [redirectCount, setRedirectCount] = useState(0);

  useEffect(() => {
    // Retrieve the current redirect count from storage
    chrome.storage.sync.get('redirectCount', (result: { redirectCount: number }) => {
      if (result.redirectCount) {
        setRedirectCount(result.redirectCount);
      }
    });

    // Listen for changes to the redirect count in storage and update the state accordingly
    chrome.storage.onChanged.addListener((changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes.redirectCount) {
        setRedirectCount(changes.redirectCount.newValue);
      }
    });
  }, []);

  // Increment the redirect count and update storage
  function incrementRedirectCount() {
    chrome.storage.sync.get('redirectCount', (result: { redirectCount: number }) => {
      const newCount = result.redirectCount ? result.redirectCount + 1 : 1;
      chrome.storage.sync.set({ redirectCount: newCount }, () => {
        // Update the redirect count in state and immediately display it
        setRedirectCount(newCount);
      });
    });
  }

  // Call incrementRedirectCount when the component mounts
  useEffect(() => {
    incrementRedirectCount();
  }, []);

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
