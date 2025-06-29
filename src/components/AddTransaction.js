import React, { useState, useEffect } from 'react';

const AddTransaction = ({ expenses, setExpenses }) => {
  const [newExpense, setNewExpense] = useState({ category: '', amount: '' });

  /* Load saved expenses once */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('expenses')) || [];
    setExpenses(saved);
  }, [setExpenses]);

  const addTransaction = () => {
    if (!newExpense.category || !newExpense.amount) return;

    const entry = {
      id: Date.now(),
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      date: new Date().toLocaleDateString(),
    };

    const updated = [entry, ...expenses];            // newest first
    setExpenses(updated);
    setNewExpense({ category: '', amount: '' });
    localStorage.setItem('expenses', JSON.stringify(updated));
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-center">➕ Add a Transaction</h2>

      {/* Add Form */}
      <div className="bg-white p-4 shadow rounded space-y-4">
        <input
          type="text"
          placeholder="Category"
          value={newExpense.category}
          onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <button
          onClick={addTransaction}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Add Transaction
        </button>
      </div>

      {/* Recent Activity – newest first */}
      <div className="bg-white p-4 shadow rounded">
        <h3 className="text-xl font-semibold mb-3">📝 Recent Transactions</h3>
        <ul className="list-disc list-inside max-h-64 overflow-y-auto space-y-1">
          {expenses.map(e => (
            <li key={e.id} className="flex justify-between">
              <span>{e.category}: ${e.amount}</span>
              <span className="text-sm text-gray-500">{e.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddTransaction;
