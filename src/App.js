import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import AddTransaction from './components/AddTransaction';
import BudgetPlan from './components/BudgetPlan'; // includes income + transactions
import SetGoal from './components/SetGoal';
import LearnScreen from './components/LearnScreen';
import NavBar from './components/NavBar';

function App() {
  const [screen, setScreen] = useState('dashboard');
  const [theme, setTheme] = useState('pastel-pink');
  const [balance, setBalance] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState(() => JSON.parse(localStorage.getItem('goals')) || []
  );

  // Load saved expenses on load
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  // Save expenses to localStorage on change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Save goals to local storage on change:
  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
  // whenever the user changes screens, refresh goals from localStorage
    const latest = JSON.parse(localStorage.getItem('goals')) || [];
    setGoals(latest);
  }, [screen]);

  useEffect(() => {
    const savedIncomes = JSON.parse(localStorage.getItem('incomes')) || [];
    const mustHaves = JSON.parse(localStorage.getItem('mustHaves')) || [];
    const goalAllocations = JSON.parse(localStorage.getItem('goalAllocations')) || [];
    const minSavings = parseFloat(localStorage.getItem('minSavings')) || 100;

    const totalIncome = savedIncomes.reduce((sum, inc) => sum + (parseFloat(inc.amount) || 0), 0);
    const mustHaveTotal = mustHaves.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const goalTotal = goalAllocations.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const allowance = totalIncome - mustHaveTotal - goalTotal - minSavings;

    setBalance(totalIncome);
    setAllowance(allowance);
  }, [screen]);


  const themeToClass = {
    'pastel-pink': 'bg-[#ffe4e1]',
    'beige': 'bg-[#fef6e4]',
    'sage-light': 'bg-[#cfe3d4]',
    'soft-blue': 'bg-[#d6e6f2]',
  };

  return (
    <div className={`min-h-screen ${themeToClass[theme]}`}>
      {/* Theme Selector */}
      <div className="flex justify-end p-2 bg-white">
        <select
          className="p-2 border rounded"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          <option value="pastel-pink">🌸 Pastel Pink</option>
          <option value="beige">🟤 Beige</option>
          <option value="sage-light">🌿 Sage Light</option>
          <option value="soft-blue">💧 Soft Blue</option>
        </select>
      </div>

      {/* Navigation */}
      <NavBar setScreen={setScreen} />

      {/* Screens */}
      {screen === 'dashboard' && (
        <Dashboard balance={balance} expenses={expenses} allowance={allowance}/>
      )}
      {screen === 'add' &&(
        <AddTransaction expenses={expenses} setExpenses={setExpenses}/>
      )}
      {screen === 'budget' && (
        <BudgetPlan
          onBalanceChange={setBalance}
          onAllowanceChange={setAllowance}
          expenses={expenses}
          setExpenses={setExpenses}
        />
      )}
      {screen === 'goal' && <SetGoal goals={goals} setGoals={setGoals} />}
      {screen === 'learn' && <LearnScreen />}
    </div>
  );
}

export default App;
