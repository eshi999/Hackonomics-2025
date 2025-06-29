import React from 'react';
import Lottie from 'lottie-react';

/* Free ‘Blooming Lotus’ JSON from LottieFiles (Vishakha Ghodekar) */
import lotusAnim from '../assets/lotus-bloom.json';

/**
 * Props:
 *  name    – goal label
 *  amount  – current allocation
 *  onChange(newAmount)
 */
export default function LotusGoal({ name, amount, onChange }) {
  return (
    <div className="relative flex flex-col items-center mb-4">
      {/* lotus animation */}
      <Lottie animationData={lotusAnim} loop={false} className="w-32" />

      {/* goal name over the flower */}
      <span className="absolute top-1/2 -translate-y-1/2 text-sm font-semibold">
        {name}
      </span>

      {/* allocation input under the flower */}
      <input
        type="number"
        value={amount === 0 ? '' : amount}
        onChange={e => onChange(e.target.value === '' ? 0 : +e.target.value)}
        className="mt-2 w-24 border rounded text-center"
      />
    </div>
  );
}
