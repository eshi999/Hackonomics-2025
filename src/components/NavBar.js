import React from 'react';

const NavBar = ({ setScreen }) => (
  <nav className="bg-sage text-white p-4 flex justify-around">
    {/* 👇 all route ids now lowercase to match <App /> */}
    <button onClick={() => setScreen('dashboard')}>Dashboard</button>
    <button onClick={() => setScreen('add')}>Add</button>
    <button onClick={() => setScreen('budget')}>Budget</button>
    <button onClick={() => setScreen('goal')}>Goals</button>
    <button onClick={() => setScreen('learn')}>Learn</button>
  </nav>
);

export default NavBar;
