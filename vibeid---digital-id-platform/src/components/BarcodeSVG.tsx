import React from 'react';

interface BarcodeSVGProps {
  value: string;
  width?: number;
  height?: number;
  color?: string;
  showText?: boolean;
  className?: string;
}

export const BarcodeSVG: React.FC<BarcodeSVGProps> = ({
  value,
  width = 120,
  height = 36,
  color = '#111111',
  showText = false,
  className = '',
}) => {
  // Generate repeatable deterministic pattern of bar widths based on input string
  const str = (value || 'HHG-2026-8891').toUpperCase();
  
  // Calculate bar pattern
  const bars: { width: number; gap: number }[] = [];
  let seed = 0;
  for (let i = 0; i < str.length; i++) {
    seed += str.charCodeAt(i);
  }

  // Guard bars
  bars.push({ width: 2, gap: 1 });
  bars.push({ width: 1, gap: 2 });

  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    const w1 = (charCode % 3) + 1;
    const g1 = ((charCode * 2) % 3) + 1;
    const w2 = ((charCode * 3) % 2) + 1;
    const g2 = (charCode % 2) + 1;

    bars.push({ width: w1, gap: g1 });
    bars.push({ width: w2, gap: g2 });
  }

  // End guard bars
  bars.push({ width: 1, gap: 2 });
  bars.push({ width: 2, gap: 1 });

  let x = 0;
  const barElements = bars.map((bar, idx) => {
    const rectX = x;
    x += bar.width + bar.gap;
    return (
      <rect
        key={idx}
        x={rectX}
        y={0}
        width={bar.width}
        height={height - (showText ? 12 : 0)}
        fill={color}
      />
    );
  });

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${Math.max(x, 60)} ${height}`}
        preserveAspectRatio="none"
        className="block"
      >
        {barElements}
      </svg>
      {showText && (
        <span className="text-[9px] font-mono tracking-widest text-slate-700 font-bold mt-0.5">
          *{value}*
        </span>
      )}
    </div>
  );
};
