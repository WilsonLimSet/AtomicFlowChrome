import React, { useState, useEffect, useCallback } from 'react';
import logo1 from '@assets/img/youtube.svg';
import logo2 from '@assets/img/facebook.svg';
import logo3 from '@assets/img/reddit.svg';
import logo4 from '@assets/img/instagram.svg';
import logo5 from '@assets/img/linkedin.svg';

const websites = [
  { name: 'YouTube', logo: logo1 },
  { name: 'Facebook', logo: logo2 },
  { name: 'Reddit', logo: logo3 },
  { name: 'Instagram', logo: logo4 },
  { name: 'LinkedIn', logo: logo5 },
];

interface WebsiteItemProps {
  name: string;
  logo: string;
  checked: boolean;
  index: number;
  onCheckboxChange: (index: number) => void;
}

const WebsiteItem: React.FC<WebsiteItemProps> = ({ name, logo, checked, index, onCheckboxChange }) => (
  <div className="flex items-center justify-between my-2">
    <div className="flex items-center">
      <img src={logo} alt={`logo-${index}`} className="w-8 h-8 mr-2" />
      <span className="text-white text-xl">{name}</span>
    </div>
    <label>
      <input
        type="checkbox"
        className="toggle toggle-warning"
        checked={checked}
        onChange={() => onCheckboxChange(index)}
      />
    </label>
  </div>
);

export default function Popup(): JSX.Element {
  const [isChecked, setIsChecked] = useState([false, false, false, false, false]);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get('isChecked', (result: { isChecked: boolean[] }) => {
        if (result.isChecked) {
          setIsChecked(result.isChecked);
        }
      });
    }
  }, []);

  const handleCheckboxChange = useCallback((index: number): void => {
    const updatedChecked = [...isChecked];
    updatedChecked[index] = !updatedChecked[index];
    setIsChecked(updatedChecked);

    chrome.storage.sync.set({ isChecked: updatedChecked });
  }, [isChecked]);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-4 m-0 bg-gray-800 overflow-hidden">
      <header className="flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold">Atomic Flow</h1>
      </header>

      {websites.map((website, index) => (
        <WebsiteItem
          key={index}
          name={website.name}
          logo={website.logo}
          checked={isChecked[index]}
          index={index}
          onCheckboxChange={handleCheckboxChange}
        />
      ))}
    </div>
  );
}
