import React from 'react';
import logo from '@assets/img/logo.svg';

export default function Popup(): JSX.Element {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 bg-gray-800">
      <header className="flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold">Garlic bread with cheese: What the science tells us</h1>
       
        <div className="form-control w-52">
    <label className="cursor-pointer label">
      <span className="label-text">Remember me</span> 
      <input type="checkbox" className="toggle toggle-secondary" checked />
    </label>
  </div>
        <a
          className="text-blue-400"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React!
        </a>
        <p>Popup styled with TailwindCSS!</p>
      </header>
    </div>
  );
}
