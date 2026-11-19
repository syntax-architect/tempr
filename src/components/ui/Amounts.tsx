import React from 'react';

export interface RupeeAmountProps {
  amount: number; // In Rupees (or paise if isPaise=true)
  isPaise?: boolean;
  shortFormat?: boolean; // Formats as Lakh / Cr
  className?: string;
  decimals?: number;
}

export const RupeeAmount: React.FC<RupeeAmountProps> = ({
  amount,
  isPaise = false,
  shortFormat = false,
  className = '',
  decimals = 2,
}) => {
  const inRupees = isPaise ? amount / 100 : amount;

  let displayStr = '';

  if (shortFormat) {
    const absVal = Math.abs(inRupees);
    if (absVal >= 10_000_000) {
      // Crores
      displayStr = `${(inRupees / 10_000_000).toFixed(decimals)} Cr`;
    } else if (absVal >= 100_000) {
      // Lakhs
      displayStr = `${(inRupees / 100_000).toFixed(decimals)} Lakh`;
    } else if (absVal >= 1_000) {
      displayStr = `${(inRupees / 1_000).toFixed(decimals)}k`;
    } else {
      displayStr = inRupees.toFixed(decimals);
    }
  } else {
    // Format using Indian numbering system (en-IN)
    displayStr = inRupees.toLocaleString('en-IN', {
      maximumFractionDigits: decimals,
      minimumFractionDigits: inRupees % 1 === 0 ? 0 : decimals,
    });
  }

  return <span className={`font-mono tabular-nums font-semibold ${className}`}>₹{displayStr}</span>;
};

export interface EuroAmountProps {
  amount: number; // In Euros
  className?: string;
  decimals?: number;
}

export const EuroAmount: React.FC<EuroAmountProps> = ({ amount, className = '', decimals = 2 }) => {
  const formatted = amount.toLocaleString('de-DE', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: amount % 1 === 0 ? 0 : decimals,
  });

  return <span className={`font-mono tabular-nums font-semibold ${className}`}>€{formatted}</span>;
};
