import React, { useState, useEffect } from 'react';
import './LearnScreen.css';

const flipSound = new Audio('/flip.mp3');

const topics = [
  {
    id: 1,
    title: 'Budgeting 💸',
    brief: 'Plan where your money goes before it disappears.',
    detail: 'Budgeting helps you organize income and expenses so you can avoid overspending and save intentionally. Use a 50/30/20 rule or create a custom breakdown.',
    fact: 'DYK? People who track spending weekly save 2x more!'
  },
  {
    id: 2,
    title: 'Stocks 📈',
    brief: 'Own a slice of a public company.',
    detail: 'Buying a stock means buying ownership in a company. Your investment grows as the company succeeds, but you also share in its risk. Diversify and invest for the long-term.',
    fact: 'DYK? The S&P 500 has averaged ~10% returns annually since 1928.'
  },
  {
    id: 3,
    title: 'Savings 🏦',
    brief: 'Money you set aside, not spend.',
    detail: 'Savings help you prepare for emergencies and big purchases. Try to save a portion of every dollar you earn.',
    fact: 'DYK? 40% of Americans can’t cover a $400 emergency.'
  },
  {
    id: 4,
    title: 'Mutual Funds 📊',
    brief: 'A basket of investments managed by pros.',
    detail: 'Mutual funds pool your money with others to invest in a range of stocks or bonds, offering diversification with less work.',
    fact: 'DYK? Some mutual funds charge a fee called “expense ratio.”'
  },
  {
    id: 5,
    title: 'Loans 💳',
    brief: 'Borrowed money — with strings attached.',
    detail: 'Loans help pay for big things now (like college), but must be paid back over time — with interest. Borrow smart.',
    fact: 'DYK? Student loan interest can start accruing immediately.'
  },
  {
    id: 6,
    title: 'Credit Scores 🔢',
    brief: 'Your financial trust score.',
    detail: 'Credit scores affect your ability to get loans, credit cards, and even apartments. Pay bills on time and keep balances low to build a good score.',
    fact: 'DYK? FICO scores range from 300 to 850.'
  },
  {
    id: 7,
    title: 'Bank Accounts 🏛️',
    brief: 'Store and access your money safely.',
    detail: 'Checking accounts are for everyday transactions; savings accounts are for setting money aside. Online banks often offer higher interest rates.',
    fact: 'DYK? FDIC insures up to $250,000 in deposit accounts.'
  },
  {
    id: 8,
    title: 'Student Loans 🎓',
    brief: 'Financial aid with a payback plan.',
    detail: 'Federal student loans usually have lower interest rates. Explore grants and scholarships before borrowing.',
    fact: 'DYK? Visit https://studentaid.gov for more info.'
  },
  {
    id: 9,
    title: 'Taxes & IRS 💼',
    brief: 'Paying your share for public services.',
    detail: 'Everyone who earns money must report income and potentially pay taxes. File a tax return each year.',
    fact: 'DYK? You can file for free at https://irs.gov.'
  },
  {
    id: 10,
    title: 'Inflation 📉',
    brief: 'Prices rising over time.',
    detail: 'Inflation reduces purchasing power. The Federal Reserve raises or lowers interest rates to help control it.',
    fact: 'DYK? 2% is the Fed’s long-term inflation target.'
  },
  {
    id: 11,
    title: 'Interest Rates 🔁',
    brief: 'The cost of borrowing money.',
    detail: 'Interest affects your credit card balance, loan payments, and savings growth. Lower rates = cheaper borrowing.',
    fact: 'DYK? Compound interest helps your savings grow faster.'
  },
  {
    id: 12,
    title: '401(k) & IRA 👴',
    brief: 'Retirement savings options.',
    detail: 'Start early to grow retirement funds over time. 401(k)s may offer employer matching; IRAs are flexible for individual investors.',
    fact: 'DYK? Compound growth makes starting early powerful.'
  },
  {
    id: 13,
    title: 'Insurance Basics 🚗🩺',
    brief: 'Protection for you and your stuff.',
    detail: 'Auto, health, renters, and life insurance all help protect you financially in emergencies.',
    fact: 'DYK? Some colleges offer student health insurance plans.'
  },
  {
    id: 14,
    title: 'Avoiding Scams 🚨',
    brief: 'Protect yourself from fraud.',
    detail: 'Be cautious with online links, unknown phone calls, and unusual payment requests.',
    fact: 'DYK? Learn more at https://consumer.ftc.gov.'
  },
  {
    id: 15,
    title: 'The Federal Reserve 🏦',
    brief: 'U.S. central bank system.',
    detail: 'Controls monetary policy, interest rates, and helps stabilize the economy.',
    fact: 'DYK? The Fed has 12 regional banks.'
  },
  {
    id: 16,
    title: 'GDP & CPI 📊',
    brief: 'Economic indicators that matter.',
    detail: 'GDP tracks total value of goods/services produced; CPI measures price changes over time.',
    fact: 'DYK? CPI is what we mean by "inflation rate."'
  },
  {
    id: 17,
    title: 'Supply & Demand ⚖️',
    brief: 'Why prices rise or fall.',
    detail: 'When supply is low and demand is high, prices rise. Markets balance when supply matches demand.',
    fact: 'DYK? This is the foundation of most market economies.'
  },
  {
    id: 18,
    title: 'Side Hustles 💼',
    brief: 'Earn extra money beyond your main job.',
    detail: 'Freelance, part-time gigs, or selling online can help boost your income.',
    fact: 'DYK? 39% of Americans have a side hustle.'
  },
  {
    id: 19,
    title: 'Crypto & Blockchain ₿',
    brief: 'Digital assets built on decentralized tech.',
    detail: 'Crypto can be risky. Learn the tech, store assets securely, and never invest more than you can lose.',
    fact: 'DYK? Over 10,000 cryptocurrencies exist.'
  },
  {
    id: 20,
    title: 'Emergency Funds 🆘',
    brief: 'Your safety net for tough times.',
    detail: 'Save 3–6 months of essential expenses in a separate, easily accessible account.',
    fact: 'DYK? This helps avoid credit card debt in emergencies.'
  },
  {
    id: 21,
    title: 'Minimum Wage & Labor Rights 💪',
    brief: 'Know what you’re owed.',
    detail: 'Learn what your local minimum wage is, and your rights around working hours and safety.',
    fact: 'DYK? See https://www.dol.gov/agencies/whd for worker protections.'
  },
  {
    id: 22,
    title: 'Economic Inequality 📉📈',
    brief: 'The gap between rich and poor.',
    detail: 'Policies like taxes, benefits, and education can help reduce disparities.',
    fact: 'DYK? Top 1% of earners hold more wealth than bottom 90% in the U.S.'
  },
  {
    id: 23,
    title: 'Government Spending 🏛️',
    brief: 'Where tax money goes.',
    detail: 'From healthcare to defense to education, government spending shapes the economy.',
    fact: 'DYK? About 70% of U.S. federal spending goes to Social Security, Medicare, and defense.'
  },
  {
    id: 24,
    title: 'How to Start Investing 🚀',
    brief: 'Begin with confidence.',
    detail: 'Start small, automate contributions, and choose diversified options like ETFs or index funds.',
    fact: 'DYK? Investing early beats investing big later.'
  },
  {
    id: 25,
    title: 'Avoiding Debt Traps 🚫💳',
    brief: 'Don’t borrow more than you can repay.',
    detail: 'Pay your credit card in full each month. Don’t take payday loans. Build an emergency fund first.',
    fact: 'DYK? Carrying a balance racks up interest quickly.'
  },
];

const LearnScreen = () => {
  const [flipped, setFlipped] = useState({});
  const [seen, setSeen] = useState(new Set());

  const toggleFlip = (id) => {
    flipSound.play();
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
    setSeen((prev) => new Set(prev).add(id));
  };

  const percentViewed = Math.round((seen.size / topics.length) * 100);

  return (
    <div className="relative">
      {Object.values(flipped).includes(true) && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-0"></div>
      )}
      <div className="p-6 max-w-6xl mx-auto relative z-10">
        <h2 className="text-3xl font-bold text-center mb-6">📚 Financial Literacy Crash Course</h2>
        <div className="mb-4">
          <p className="text-center text-sm mb-1">Progress: {percentViewed}% viewed</p>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="h-2 bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${percentViewed}%` }}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className={`flip-card ${flipped[topic.id] ? 'flipped' : ''}`}
              onClick={() => toggleFlip(topic.id)}
            >
              <div className="flip-card-inner">
                <div className="flip-card-front bg-white p-4 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-2">{topic.title}</h3>
                  <p className="text-sm text-gray-700">{topic.brief}</p>
                </div>
                <div className="flip-card-back bg-green-100 p-4 rounded-lg shadow text-gray-800">
                  <h3 className="text-lg font-bold mb-1">{topic.title}</h3>
                  <p className="text-sm mb-2">{topic.detail}</p>
                  <p className="text-xs italic text-green-900">💡 {topic.fact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearnScreen;