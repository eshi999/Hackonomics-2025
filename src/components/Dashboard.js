import React, { useState, useMemo } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const months = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];
const keyFor = (y, m) => `budget-${y}-${m}`;

/* ------- helper: read savings for a given y,m ------- */
const getSavings = (year, month) => {
  const saved = JSON.parse(localStorage.getItem(keyFor(year, month)));
  if (!saved) return 0;

  const totalIncome = saved.incomes       .reduce((s, i) => s + (+i.amount || 0), 0);
  const mustTotal   = saved.mustHaves     .reduce((s, m) => s + (+m.amount || 0), 0);
  const goalTotal   = saved.goalAllocations.reduce((s, g) => s + (+g.amount || 0), 0);
  const minSav      = +saved.minSavings || 0;

  /* actual savings = min mandatory + any leftover (but never negative) */
  return Math.max(minSav + (totalIncome - mustTotal - goalTotal - minSav), 0);
};

const Dashboard = ({ balance, allowance, expenses }) => {
  /* ---- year selector for bar chart ---- */
  const now = new Date();
  const [barYear, setBarYear] = useState(now.getFullYear());

  /* ---- pie chart (unchanged) ---- */
  const categories = [...new Set(expenses.map((e) => e.category))];
  const pieData = {
    labels: categories,
    datasets: [
      {
        data: categories.map((cat) =>
          expenses
            .filter((e) => e.category === cat)
            .reduce((sum, e) => sum + e.amount, 0)
        ),
        backgroundColor: ['#cfe3d4', '#ffd8be', '#d6e6f2', '#ffe4e1', '#fce1f0', '#f9f7cf'],
        borderWidth: 1,
      },
    ],
  };

  /* ---- bar chart: memoised per selected year ---- */
  const barData = useMemo(() => ({
    labels: months,
    datasets: [
      {
        label: `Monthly Savings (${barYear})`,
        data: months.map((_, idx) => getSavings(barYear, idx)),
        backgroundColor: '#91a377',
      },
    ],
  }), [barYear]);

  const today = now.toLocaleDateString();
  
  const defaultDashboard = {
    checking: 420.50,
    credit: 125.75,
    netCash: 546.25,
    savings: 310.00,
    investments: 80.00,
    monthlyAllowance: 250.00
  };

  const storedDashboard = JSON.parse(localStorage.getItem("demo-dashboard")) || defaultDashboard;


  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Welcome & Date */}
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-4xl font-bold text-[#800000] font-[Pacifico] mb-4 md:mb-0">
          Hello, User
        </h1>
        <p className="text-gray-600 text-md">{today}</p>
      </div>

      {/* Overview Grid (unchanged) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* account cards … */}
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold mb-2">🏦 Checking Account</h3>
          <p className="text-2xl font-bold text-green-700">${(balance * 0.5).toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold mb-2">💳 Credit/Debit Card</h3>
          <p className="text-2xl font-bold text-blue-600">${(balance * 0.25).toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold mb-2">💰 Net Cash</h3>
          <p className="text-2xl font-bold text-gray-800">${balance.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold mb-2">💾 Savings</h3>
          <p className="text-2xl font-bold text-purple-700">${(balance * 0.15).toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold mb-2">📈 Investments</h3>
          <p className="text-2xl font-bold text-yellow-600">${(balance * 0.1).toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold mb-2">🧾 Monthly Allowance</h3>
          <p className="text-2xl font-bold text-red-700">
            ${allowance > 0 ? allowance.toFixed(2) : '0.00'}
          </p>
          {allowance < 0 && <p className="text-red-500 text-sm mt-1">⚠️ Over budget</p>}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie (unchanged) */}
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold mb-2">📊 Spending by Category</h3>
          <Pie data={pieData} />
        </div>

        {/* Bar + Year picker */}
        <div className="bg-white p-4 shadow rounded">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">📈 Monthly Savings</h3>
            <select
              className="border p-1 rounded"
              value={barYear}
              onChange={(e) => setBarYear(+e.target.value)}
            >
              {[...Array(6)].map((_, i) => {
                const y = now.getFullYear() - 2 + i;
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
          </div>
          <Bar data={barData} />
        </div>
      </div>

      {/* Recent Transactions – newest first */}
      <div className="bg-white p-4 shadow rounded">
        <h3 className="text-xl font-semibold mb-3">📝 Recent Transactions</h3>
        <ul className="max-h-64 overflow-y-auto space-y-2">
          {expenses.map((e) => (
            <li key={e.id} className="flex justify-between">
              <span>{e.category}: ${e.amount}</span>
              <span className="text-sm text-gray-500">{e.date || today}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
