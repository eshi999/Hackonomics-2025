// src/components/BudgetPlan.js
import React, { useState, useEffect, useCallback } from 'react';

import LotusGoal from './LotusGoal';
import WateringFlash from './WateringFlash';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const keyFor = (y, m) => `budget-${y}-${m}`;

const defaultBudget = {
  incomes: [{ id: 1, label: '', amount: 0 }],
  mustHaves: [
    { id: 1, name: 'Student Loans', amount: 120 },
    { id: 2, name: 'Phone Bill', amount: 40 },
    { id: 3, name: 'Medicine', amount: 30 },
  ],
  goalAllocations: [],
  minSavings: 100,
};

const fetchGoals = () => JSON.parse(localStorage.getItem('goals')) || [];

export default function BudgetPlan({ onBalanceChange, onAllowanceChange }) {
  /* ── top-level state ───────────────────────────── */
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const [incomes, setIncomes] = useState(defaultBudget.incomes);
  const [mustHaves, setMustHaves] = useState(defaultBudget.mustHaves);
  const [goalAllocations, setGoalAllocations] = useState(
    defaultBudget.goalAllocations,
  );
  const [minSavings, setMinSavings] = useState(defaultBudget.minSavings);

  const [newMust, setNewMust] = useState({ name: '', amount: '' });
  const [waterKey, setWaterKey] = useState(0); // watering animation trigger

  /* ── load month-year budget ────────────────────── */
  const loadBudget = useCallback(() => {
    const saved =
      JSON.parse(localStorage.getItem(keyFor(year, month))) || defaultBudget;

    /* merge master goals list */
    const masterGoals = fetchGoals();
    const mergedGoalRows = masterGoals.map((g) => {
      const match = saved.goalAllocations.find(
        (s) => s.id === g.id || s.name === g.name,
      );
      return match ? match : { id: g.id, name: g.name, amount: g.saved ?? 0 };
    });

    setIncomes(saved.incomes.map((r) => ({ id: r.id ?? Date.now(), ...r })));
    setMustHaves(saved.mustHaves.map((r) => ({ id: r.id ?? Date.now(), ...r })));
    setGoalAllocations(mergedGoalRows);
    setMinSavings(saved.minSavings);
  }, [year, month]);

  useEffect(loadBudget, [loadBudget]);

  /* ── persist & recalc ──────────────────────────── */
  const persistAndRecalc = useCallback(() => {
    const totalIncome = incomes.reduce((s, i) => s + (+i.amount || 0), 0);
    const mustTotal = mustHaves.reduce((s, m) => s + (+m.amount || 0), 0);
    const goalTotal = goalAllocations.reduce((s, g) => s + (+g.amount || 0), 0);
    const allowance = totalIncome - mustTotal - goalTotal - minSavings;

    onBalanceChange(totalIncome);
    onAllowanceChange(allowance);

    /* save month-specific budget */
    localStorage.setItem(
      keyFor(year, month),
      JSON.stringify({ incomes, mustHaves, goalAllocations, minSavings }),
    );

    /* sync “saved” dollars back to master goals list */
    const master = JSON.parse(localStorage.getItem('goals')) || [];
    const merged = master.map((g) => {
      const row = goalAllocations.find((r) => r.id === g.id || r.name === g.name);
      return row ? { ...g, saved: row.amount } : g;
    });
    localStorage.setItem('goals', JSON.stringify(merged));
  }, [
    incomes,
    mustHaves,
    goalAllocations,
    minSavings,
    year,
    month,
    onBalanceChange,
    onAllowanceChange,
  ]);

  useEffect(persistAndRecalc, [
    incomes,
    mustHaves,
    goalAllocations,
    minSavings,
    persistAndRecalc,
  ]);

  /* ── helpers ───────────────────────────────────── */
  const addIncomeField = () =>
    setIncomes([...incomes, { id: Date.now(), label: '', amount: 0 }]);

  const removeIncome = (id) => setIncomes(incomes.filter((i) => i.id !== id));

  const addMustHave = () => {
    if (!newMust.name.trim() || !newMust.amount) return;
    setMustHaves([
      ...mustHaves,
      { id: Date.now(), name: newMust.name.trim(), amount: +newMust.amount },
    ]);
    setNewMust({ name: '', amount: '' });
  };

  const removeMustHave = (id) =>
    setMustHaves(mustHaves.filter((m) => m.id !== id));

  /* ── UI ────────────────────────────────────────── */
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-center">
        📊 Monthly Budget Planner
      </h2>

      {/* period picker */}
      <div className="flex gap-4 justify-center mb-4">
        <select
          className="border p-2 rounded"
          value={year}
          onChange={(e) => setYear(+e.target.value)}
        >
          {[...Array(6)].map((_, i) => {
            const y = now.getFullYear() - 2 + i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>

        <select
          className="border p-2 rounded"
          value={month}
          onChange={(e) => setMonth(+e.target.value)}
        >
          {months.map((m, idx) => (
            <option key={m} value={idx}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* incomes */}
      <div className="bg-white p-4 shadow rounded">
        <h3 className="font-semibold mb-2">💼 Income Sources</h3>
        {incomes.map((inc, idx) => (
          <div key={inc.id} className="flex gap-2 items-center mb-2">
            <select
              className="border p-2 rounded flex-1"
              value={inc.label}
              onChange={(e) => {
                const updated = [...incomes];
                updated[idx].label = e.target.value;
                setIncomes(updated);
              }}
            >
              <option value="">Select type…</option>
              <option value="Pocket Money">Pocket Money</option>
              <option value="Part-time Job">Part-time Job</option>
              <option value="Scholarship / Grant">Scholarship / Grant</option>
              <option value="Internship Stipend">Internship Stipend</option>
              <option value="Freelance / Side Gig">
                Freelance / Side Gig
              </option>
              <option value="Gift">Gift</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="number"
              placeholder="Amount"
              value={inc.amount}
              onChange={(e) => {
                const updated = [...incomes];
                updated[idx].amount = e.target.value;
                setIncomes(updated);
              }}
              className="w-32 border p-2 rounded text-right"
            />

            <button
              onClick={() => removeIncome(inc.id)}
              className="text-red-500 text-sm"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={addIncomeField}
          className="mt-2 text-blue-600 underline"
        >
          + Add Another Income
        </button>
      </div>

      {/* must-haves */}
      <div className="bg-white p-4 shadow rounded space-y-4">
        <h3 className="font-semibold">🧾 Must-Haves</h3>

        {mustHaves.map((item) => (
          <div key={item.id} className="flex gap-2 items-center mb-2">
            <input
              type="text"
              value={item.name}
              onChange={(e) => {
                const updated = mustHaves.map((m) =>
                  m.id === item.id ? { ...m, name: e.target.value } : m,
                );
                setMustHaves(updated);
              }}
              className="flex-1 border p-1 rounded"
            />

            <input
              type="number"
              value={item.amount}
              onChange={(e) => {
                const updated = mustHaves.map((m) =>
                  m.id === item.id ? { ...m, amount: +e.target.value } : m,
                );
                setMustHaves(updated);
              }}
              className="w-24 border p-1 rounded text-right"
            />

            <button
              onClick={() => removeMustHave(item.id)}
              className="text-red-500 text-sm"
            >
              ✕
            </button>
          </div>
        ))}

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="New item"
            value={newMust.name}
            onChange={(e) => setNewMust({ ...newMust, name: e.target.value })}
            className="flex-1 border p-2 rounded"
          />
          <input
            type="number"
            placeholder="$"
            value={newMust.amount}
            onChange={(e) => setNewMust({ ...newMust, amount: e.target.value })}
            className="w-28 border p-2 rounded text-right"
          />
          <button
            onClick={addMustHave}
            className="bg-blue-600 text-white px-3 rounded"
          >
            + Add
          </button>
        </div>
      </div>

      {/* goals */}
      <div className="bg-white p-4 shadow rounded">
        <h3 className="font-semibold mb-2">🎯 Goals</h3>

        {goalAllocations.length === 0 && (
          <p className="text-sm text-gray-500">
            No goals yet – create them on the <strong>Goals</strong> page.
          </p>
        )}

        {goalAllocations.map((g) => (
          <LotusGoal
            key={g.id}
            name={g.name}
            amount={g.amount}
            onChange={(val) => {
              const updated = goalAllocations.map((goal) =>
                goal.id === g.id ? { ...goal, amount: val } : goal,
              );
              setGoalAllocations(updated);
              setWaterKey((k) => k + 1);

              /* sync master goals.saved instantly */
              const stored = JSON.parse(localStorage.getItem('goals')) || [];
              const synced = stored.map((goal) =>
                goal.id === g.id ? { ...goal, saved: val } : goal,
              );
              localStorage.setItem('goals', JSON.stringify(synced));
            }}
          />
        ))}

        <p className="text-xs text-gray-400 text-center">
          (Add or rename goals on the <strong>Goals</strong> page.)
        </p>
      </div>

      {/* watering animation */}
      <WateringFlash trigger={waterKey} />

      {/* savings */}
      <div className="bg-white p-4 shadow rounded">
        <label className="block mb-2 font-semibold">💰 Minimum Savings</label>
        <input
          type="number"
          value={minSavings}
          onChange={(e) => setMinSavings(+e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <button
        onClick={persistAndRecalc}
        className="bg-green-600 text-white px-6 py-2 rounded block mx-auto"
      >
        💾 Save Budget Plan
      </button>
    </div>
  );
}
