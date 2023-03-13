import React, { useState, useEffect } from 'react';
import logo1 from '@assets/img/youtube.svg';
import logo2 from '@assets/img/twitter.svg';
import logo3 from '@assets/img/reddit.svg';
import logo4 from '@assets/img/instagram.svg';
import logo5 from '@assets/img/linkedin.svg';

declare const chrome: any;
export default function Popup(): JSX.Element {
  
  const [isChecked, setIsChecked] = useState([false, false, false, false, false]);

  useEffect(() => { 
    // Load the saved state from chrome storage when the component mounts
    if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.sync.get('isChecked', (result: {isChecked: boolean[]}) => {
      if (result.isChecked) {
        setIsChecked(result.isChecked);
      }
    });
  }
  }, []);

  const handleCheckboxChange = (index: number): void => {
    const updatedChecked = [...isChecked];
    updatedChecked[index] = !updatedChecked[index];
    setIsChecked(updatedChecked);
    
  
    const blockedSites = [];
    if (updatedChecked[0]) {
      blockedSites.push('*://*.youtube.com/*');
    }
    if (updatedChecked[1]) {
      blockedSites.push('*://*.twitter.com/*');
    }
    if (updatedChecked[2]) {
      blockedSites.push('*://*.reddit.com/*');
    }
    if (updatedChecked[3]) {
      blockedSites.push('*://*.instagram.com/*');
    }
    if (updatedChecked[4]) {
      blockedSites.push('*://*.linkedin.com/*');
    }
  
    // Save the updated state to chrome storage
    chrome.storage.sync.set({ isChecked: updatedChecked });
  };

  const logoText = ['Youtube', 'Twitter', 'Reddit', 'Instagram', 'LinkedIn'];
  const logos = [logo1, logo2, logo3, logo4, logo5];

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-4 m-0 bg-gray-800 overflow-hidden">
      <header className="flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold">Atomic Flow</h1>
      </header>

      {logos.map((logo, index) => (
        <div className="flex items-center justify-between my-2" key={index}>
          <div className="flex items-center">
            <img src={logo} alt={`logo-${index}`} className="w-8 h-8 mr-2" />
            <span className="text-white text-xl">{logoText[index]}</span>
          </div>
          <label>
            <input
              type="checkbox"
              className="toggle toggle-warning"
              checked={isChecked[index]}
              onChange={() => handleCheckboxChange(index)}
            />
          </label>
        </div>
      ))}
    </div>
  );
}
