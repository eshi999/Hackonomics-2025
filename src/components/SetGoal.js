// src/components/SetGoal.js
import React, { useState } from 'react';
import { FiEdit2, FiCheck, FiX, FiCornerUpLeft } from 'react-icons/fi';

const exampleGoals = [
  { name: 'Save for a concert 🎶', target: 100 },
  { name: 'Buy new clothes 👕',   target: 80  },
  { name: 'Emergency fund 💼',    target: 200 },
];

/* ───────────────────────── Goal row component ───────────────────────── */
function GoalItem({ goal, onUpdate, onDelete }) {
  const [isEdit, setIsEdit]       = useState(false);
  const [draftName, setDraftName] = useState(goal.name);
  const [draftTarget, setDraftTarget] = useState(goal.target);

  const save = () => {
    onUpdate(goal.id, { name: draftName, target: +draftTarget });
    setIsEdit(false);
  };

  const progress = (goal.saved / goal.target) * 100;

  return (
    <li className="bg-white p-4 shadow rounded">
      {isEdit ? (
        <>
          <input
            className="w-full border p-1 mb-2 rounded"
            value={draftName}
            onChange={e => setDraftName(e.target.value)}
          />
          <input
            type="number"
            className="w-full border p-1 mb-3 rounded"
            value={draftTarget}
            onChange={e => setDraftTarget(e.target.value)}
          />
          <div className="flex gap-3 text-lg">
            <button onClick={save}           className="text-green-600"><FiCheck /></button>
            <button onClick={() => setIsEdit(false)} className="text-gray-500"><FiCornerUpLeft /></button>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <p className="font-medium">{goal.name}</p>
            <div className="flex gap-2 text-sm">
              <button onClick={() => setIsEdit(true)} className="text-blue-600"><FiEdit2 /></button>
              <button onClick={() => onDelete(goal.id)} className="text-red-500"><FiX /></button>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-2">
            Target: ${goal.target} | Saved: ${goal.saved}
          </p>

          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
            <div
              className="h-3 bg-sage rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </>
      )}
    </li>
  );
}

/* ───────────────────────── Main component ───────────────────────── */
export default function SetGoal({ goals, setGoals }) {
  const [name,   setName]   = useState('');
  const [target, setTarget] = useState('');

  /* add new goal */
  const handleSubmit = e => {
    e.preventDefault();
    if (!name || !target) return;
    const newGoal = { id: Date.now(), name, target: +target, saved: 0 };
    setGoals(prev => [...prev, newGoal]);
    setName('');
    setTarget('');
  };

  /* example chip click */
  const handleExampleClick = goal => {
    setName(goal.name);
    setTarget(goal.target);
  };

  /* update / delete callbacks */
  const updateGoal = (id, patch) =>
    setGoals(prev => prev.map(g => (g.id === id ? { ...g, ...patch } : g)));

  const deleteGoal = id =>
    setGoals(prev => prev.filter(g => g.id !== id));

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-center">🎯 Goal Setting</h2>

      {/* add-goal form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded space-y-4">
        <input
          type="text"
          placeholder="Set a new goal..."
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Target amount"
          value={target}
          onChange={e => setTarget(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button type="submit" className="bg-sage text-white px-4 py-2 rounded hover:bg-sage-dark">
          Add Goal
        </button>
      </form>

      {/* example chips */}
      <div>
        <h3 className="text-lg font-semibold mb-2">💡 Example Goals:</h3>
        <div className="flex flex-wrap gap-2">
          {exampleGoals.map((g, idx) => (
            <button
              key={idx}
              onClick={() => handleExampleClick(g)}
              className="bg-sage-light text-sm px-3 py-2 rounded-full hover:bg-sage"
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* current goals list */}
      <div>
        <h3 className="text-lg font-semibold mb-2">📌 Your Goals:</h3>
        <ul className="space-y-3">
          {goals.map(goal => (
            <GoalItem
              key={goal.id}
              goal={goal}
              onUpdate={updateGoal}
              onDelete={deleteGoal}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
